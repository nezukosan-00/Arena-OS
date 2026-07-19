export interface Gate {
  id: string;
  name: string;
  occupancy: number; // percentage
  accessible: boolean;
}

export interface Facility {
  id: string;
  name: string;
  type: 'food' | 'washroom' | 'merchandise';
  queueTime: number; // minutes
}

export interface Parking {
  id: string;
  zone: string;
  capacity: number;
  utilization: number; // percentage
}

export interface Volunteer {
  id: string;
  name: string;
  location: string;
  status: 'available' | 'busy';
}

export interface Incident {
  id: string;
  type: 'medical' | 'lost_child' | 'congestion' | 'accessibility';
  location: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'assigned' | 'resolved';
}

export interface RouteInfo {
  id: string;
  start: string;
  end: string;
  distance: number; // meters
  walkingTime: number; // minutes
  accessible: boolean;
  crowdDensity: number; // percentage
}

const gateData = [
  { id: 'G1', gate: 'Gate A', occupancy: 92, status: 'High', estimatedWaitMin: 18, accessible: true },
  { id: 'G2', gate: 'Gate B', occupancy: 41, status: 'Low', estimatedWaitMin: 5, accessible: true },
  { id: 'G3', gate: 'Gate C', occupancy: 68, status: 'Medium', estimatedWaitMin: 10, accessible: false },
  { id: 'G4', gate: 'Gate D', occupancy: 23, status: 'Low', estimatedWaitMin: 2, accessible: true },
];

const foodCourtData = [
  { name: 'Food Court A', waitTimeMin: 20, crowd: 'High', popularItems: ['Burger', 'Pizza'] },
  { name: 'Food Court B', waitTimeMin: 7, crowd: 'Medium', popularItems: ['Tacos', 'Fries'] },
  { name: 'Food Court C', waitTimeMin: 4, crowd: 'Low', popularItems: ['Sandwich', 'Coffee'] },
];

const restroomData = [
  { location: 'North Stand', queue: 3, accessible: true, cleanliness: 'Excellent' },
  { location: 'East Stand', queue: 8, accessible: true, cleanliness: 'Good' },
  { location: 'South Stand', queue: 1, accessible: false, cleanliness: 'Excellent' },
];

const transportData = [
  { service: 'Metro Line 2', status: 'Running', nextArrival: '5 min', crowd: 'Low' },
  { service: 'Shuttle Bus A', status: 'Delayed', nextArrival: '12 min', crowd: 'Medium' },
  { service: 'Parking P1', availableSpaces: 124 },
];

const volunteerData = [
  { id: 'V101', name: 'Volunteer 1', location: 'Gate A', status: 'Available' },
  { id: 'V102', name: 'Volunteer 2', location: 'Section C12', status: 'Assigned' },
  { id: 'V103', name: 'Volunteer 3', location: 'Medical Bay', status: 'Available' },
];

const incidentData = [
  { id: 'INC001', type: 'Medical', location: 'Section D12', severity: 'Medium', status: 'Volunteer Assigned' },
  { id: 'INC002', type: 'Lost Child', location: 'Food Court B', severity: 'High', status: 'Security Responding' },
];

const matchData = [{ match: 'USA vs England', stadium: 'MetLife Stadium', time: '19:30', status: 'Live', score: '2-1' }];
const weatherData = [{ temperatureC: 27, condition: 'Cloudy', humidity: 71, windKmh: 14 }];

export const mockGates: Gate[] = gateData.map((gate, index) => ({
  id: `g${index + 1}`,
  name: gate.gate,
  occupancy: gate.occupancy,
  accessible: gate.accessible,
}));

export const mockFacilities: Facility[] = [
  ...foodCourtData.map((court, index) => ({
    id: `f${index + 1}`,
    name: court.name,
    type: 'food' as const,
    queueTime: court.waitTimeMin,
  })),
  ...restroomData.map((restroom, index) => ({
    id: `w${index + 1}`,
    name: restroom.location,
    type: 'washroom' as const,
    queueTime: restroom.queue,
  })),
];

export const mockParking: Parking[] = [
  { id: 'p1', zone: 'Metro Line 2', capacity: 500, utilization: 75 },
  { id: 'p2', zone: 'Shuttle Bus A', capacity: 300, utilization: 60 },
  { id: 'p3', zone: 'Parking P1', capacity: 250, utilization: 50 },
];

export const mockVolunteers: Volunteer[] = volunteerData.map((volunteer) => ({
  id: volunteer.id,
  name: volunteer.name,
  location: volunteer.location,
  status: volunteer.status === 'Available' ? 'available' : 'busy',
}));

export const mockIncidents: Incident[] = incidentData.map((incident) => ({
  id: incident.id,
  type: incident.type.toLowerCase().includes('medical') ? 'medical' : incident.type.toLowerCase().includes('child') ? 'lost_child' : 'congestion',
  location: incident.location,
  priority: incident.severity === 'High' ? 'high' : 'medium',
  status: incident.status.includes('Assigned') ? 'assigned' : 'open',
}));

export const mockRoutes: RouteInfo[] = [
  { id: 'r1', start: 'Gate A', end: 'Seat Section 101', distance: 180, walkingTime: 4, accessible: true, crowdDensity: 25 },
  { id: 'r2', start: 'Gate B', end: 'Seat Section 101', distance: 260, walkingTime: 5, accessible: true, crowdDensity: 40 },
  { id: 'r3', start: 'Gate C', end: 'Seat Section 101', distance: 140, walkingTime: 3, accessible: false, crowdDensity: 15 },
  { id: 'r4', start: 'Gate D', end: 'Seat Section 101', distance: 220, walkingTime: 4, accessible: true, crowdDensity: 30 },
];

export const getAllStadiumData = () => ({
  gates: mockGates,
  facilities: mockFacilities,
  parking: mockParking,
  volunteers: mockVolunteers,
  incidents: mockIncidents,
  routes: mockRoutes,
  matches: matchData,
  weather: weatherData,
  transport: transportData,
});
