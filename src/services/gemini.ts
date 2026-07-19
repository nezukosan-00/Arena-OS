import { getAllStadiumData } from '../data/mockData';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
const MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.0-flash-lite'];

type Role = 'fan' | 'organizer' | 'volunteer';

type AccessibilityMode = 'none' | 'wheelchair' | 'visually-impaired';

const getSystemPrompt = (role: Role, language: string, accessibilityInfo: string) => {
  const baseContext = `You are an AI assistant for ArenaOS.
Here is the current real-time arena data:
${JSON.stringify(getAllStadiumData(), null, 2)}
`;

  const languageInstruction = `IMPORTANT: You must respond entirely in ${language}.`;

  let roleInstruction = '';
  switch (role) {
    case 'fan':
      roleInstruction = `You are an AI Stadium Navigation Assistant.
Always prioritize safety, accessibility, and the least crowded route.
Use only the supplied stadium context.
Never invent information.
Address the fan directly and helpfully.
${accessibilityInfo}`;
      break;
    case 'organizer':
      roleInstruction = `You are an AI Stadium Operations Copilot.
Analyze operational data.
Identify risks.
Provide concise recommendations ranked by priority.
Format your response with clear headings or bullet points for easy reading.`;
      break;
    case 'volunteer':
      roleInstruction = `You are an AI Volunteer Coordinator.
Assign volunteers based on urgency, proximity, and accessibility requirements.
Address the volunteer directly, giving them a clear task and navigation instructions based on open incidents.`;
      break;
  }

  return `${baseContext}\n\n${roleInstruction}\n\n${languageInstruction}`;
};

const getAccessibleInfo = (accessibilityMode: AccessibilityMode) => {
  if (accessibilityMode === 'wheelchair') {
    return 'The user is a wheelchair user. YOU MUST recommend only routes and facilities that have accessible: true. Avoid stairs and steep slopes. Prioritize elevators and ramps.';
  }

  if (accessibilityMode === 'visually-impaired') {
    return 'The user is visually impaired. Provide clear, simple, step-by-step navigation instructions.';
  }

  return '';
};

const getFallbackResponse = (prompt: string, role: Role, language: string, accessibilityMode: AccessibilityMode) => {
  const data = getAllStadiumData();
  const accessibleRoute = data.routes.find((route) => route.accessible);
  const crowdedGate = [...data.gates].sort((a, b) => b.occupancy - a.occupancy)[0];
  const urgentIncident = data.incidents.find((incident) => incident.priority === 'high' || incident.priority === 'critical');

  const accessibilityNote = accessibilityMode === 'wheelchair'
    ? 'Use only accessible routes and avoid stairs.'
    : accessibilityMode === 'visually-impaired'
      ? 'Provide simple step-by-step guidance and avoid ambiguous turns.'
      : 'Keep the route straightforward and safety-first.';

  switch (role) {
    case 'fan':
      return `Local fallback guidance for ${language}:\n- Recommended route: ${accessibleRoute?.start ?? 'Gate 4'} to ${accessibleRoute?.end ?? 'Seat Section 101'} (${accessibleRoute?.walkingTime ?? 4} min, accessible).\n- Avoid ${crowdedGate?.name ?? 'Gate 2'} right now; current occupancy is ${crowdedGate?.occupancy ?? 93}%.\n- ${urgentIncident ? `Active incident near ${urgentIncident.location}.` : 'No critical incidents are currently reported.'}\n- ${accessibilityNote}\n\nYour request: ${prompt}`;
    case 'organizer':
      return `Local fallback operations summary for ${language}:\n- Highest congestion: ${crowdedGate?.name ?? 'Gate 2'} at ${crowdedGate?.occupancy ?? 93}% occupancy.\n- ${urgentIncident ? `Priority incident: ${urgentIncident.type} at ${urgentIncident.location}.` : 'No urgent incident requires immediate escalation.'}\n- Recommended action: reroute foot traffic, verify staffing, and monitor the impacted area.\n\nYour request: ${prompt}`;
    case 'volunteer':
      return `Local fallback dispatch guidance for ${language}:\n- Report to ${urgentIncident ? urgentIncident.location : 'Gate 4'} for the next priority task.\n- Keep movement efficient, confirm the incident status, and support the nearest access point.\n- ${accessibilityNote}\n\nYour request: ${prompt}`;
    default:
      return `Local fallback response for ${language}: ${prompt}`;
  }
};

const buildRequestBody = (prompt: string, role: Role, language: string, accessibilityMode: AccessibilityMode) => {
  const accessibilityInfo = getAccessibleInfo(accessibilityMode);
  const systemInstruction = getSystemPrompt(role, language, accessibilityInfo);
  const fullPrompt = `${systemInstruction}\n\nUser request: ${prompt}`;

  return {
    contents: [
      {
        role: 'user',
        parts: [{ text: fullPrompt }],
      },
    ],
  };
};

const tryGeminiRequest = async (prompt: string, role: Role, language: string, accessibilityMode: AccessibilityMode) => {
  if (!apiKey) {
    throw new Error('Missing API key');
  }

  const body = buildRequestBody(prompt, role, language, accessibilityMode);
  let lastError: Error | null = null;

  for (const model of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      console.log(`[Gemini] Attempting ${model}...`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log(`[Gemini] Response status: ${response.status}`);
      const data = await response.json().catch((e) => {
        console.error(`[Gemini] JSON parse failed:`, e);
        return null;
      });

      if (!response.ok) {
        const errorMessage = data?.error?.message || `Request failed with status ${response.status}`;
        console.error(`[Gemini] API error: ${errorMessage}`, data);

        if (response.status === 429 || /quota|resource exhausted|rate limit/i.test(errorMessage)) {
          throw new Error(`GEMINI_QUOTA_EXCEEDED:${errorMessage}`);
        }

        throw new Error(errorMessage);
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        || data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('')
        || data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (text) {
        console.log(`[Gemini] Success with ${model}`);
        return text;
      }

      throw new Error(`No response text returned by Gemini. Response: ${JSON.stringify(data)}`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[Gemini] ${model} failed: ${msg}`);
      lastError = error instanceof Error ? error : new Error('Unknown Gemini error');
    }
  }

  throw lastError || new Error('Gemini request failed unexpectedly.');
};

export const queryGemini = async (
  prompt: string,
  role: Role,
  language: string = 'English',
  accessibilityMode: AccessibilityMode = 'none'
) => {
  try {
    return await tryGeminiRequest(prompt, role, language, accessibilityMode);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Gemini API Error:', message);

    if (message.includes('GEMINI_QUOTA_EXCEEDED')) {
      return getFallbackResponse(prompt, role, language, accessibilityMode);
    }

    return `[Simulated Response - AI unavailable]\n\nThe Gemini service could not be reached. This usually means the API key is missing, invalid, or the selected model is not enabled.\n\nPlease verify VITE_GEMINI_API_KEY in your environment, ensure the Gemini API is enabled for your Google Cloud project, and restart the dev server.\n\nOriginal request: ${prompt}\n\nDebug info: ${message}`;
  }
};
