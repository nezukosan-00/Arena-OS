import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { RightPanel } from './components/layout/RightPanel';
import { LandingPage } from './pages/LandingPage';
import { FanDashboard } from './pages/FanDashboard';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { useAppContext } from './context/AppContext';

function App() {
  const { accessibilityMode } = useAppContext();

  useEffect(() => {
    if (accessibilityMode === 'visually-impaired') {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [accessibilityMode]);

  return (
    <div className="min-h-screen bg-[#050816] text-white flex overflow-hidden selection:bg-blue-500/30">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 sm:ml-20 md:ml-64 transition-all duration-300">
        <TopBar />
        
        <main className="flex-1 flex pt-16 h-screen overflow-hidden">
          {/* Main Dashboard Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20">
            <div className="max-w-[1600px] mx-auto h-full">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/fan" element={<FanDashboard />} />
                <Route path="/organizer" element={<OrganizerDashboard />} />
                <Route path="/volunteer" element={<VolunteerDashboard />} />
                <Route path="*" element={<LandingPage />} />
              </Routes>
            </div>
          </div>
          
          {/* Right Intelligence Panel */}
          <RightPanel />
        </main>
      </div>
    </div>
  );
}

export default App;
