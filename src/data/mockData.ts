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

export const mockGates: Gate[] = [
  { id: 'g1', name: 'Gate 1 (North)', occupancy: 45, accessible: true },
  { id: 'g2', name: 'Gate 2 (East)', occupancy: 93, accessible: true }, // Highly congested
  { id: 'g3', name: 'Gate 3 (South)', occupancy: 20, accessible: false }, // Stairs only
  { id: 'g4', name: 'Gate 4 (West)', occupancy: 60, accessible: true },
];

export const mockFacilities: Facility[] = [
  { id: 'f1', name: 'Food Court A', type: 'food', queueTime: 5 },
  { id: 'f2', name: 'Food Court B', type: 'food', queueTime: 20 }, // Long queue
  { id: 'w1', name: 'Washroom North', type: 'washroom', queueTime: 2 },
  { id: 'w2', name: 'Washroom South', type: 'washroom', queueTime: 12 },
];

export const mockParking: Parking[] = [
  { id: 'p1', zone: 'Zone A', capacity: 500, utilization: 95 }, // Almost full
  { id: 'p2', zone: 'Zone B', capacity: 1000, utilization: 40 },
  { id: 'p3', zone: 'VIP Parking', capacity: 100, utilization: 80 },
];

export const mockVolunteers: Volunteer[] = [
  { id: 'v1', name: 'Alice', location: 'Gate 1', status: 'available' },
  { id: 'v2', name: 'Bob', location: 'Food Court A', status: 'busy' },
  { id: 'v3', name: 'Charlie', location: 'Zone C', status: 'available' },
  { id: 'v4', name: 'Diana', location: 'Gate 4', status: 'available' },
];

export const mockIncidents: Incident[] = [
  { id: 'i1', type: 'medical', location: 'Gate 2', priority: 'high', status: 'open' },
  { id: 'i2', type: 'congestion', location: 'Food Court B', priority: 'medium', status: 'assigned' },
  { id: 'i3', type: 'accessibility', location: 'Gate 3', priority: 'high', status: 'open' }, // Needs wheelchair assistance
];

// Simplified routing nodes
export const mockRoutes: RouteInfo[] = [
  { id: 'r1', start: 'Gate 1', end: 'Seat Section 101', distance: 150, walkingTime: 3, accessible: true, crowdDensity: 20 },
  { id: 'r2', start: 'Gate 2', end: 'Seat Section 101', distance: 300, walkingTime: 6, accessible: true, crowdDensity: 90 }, // Avoid due to crowds
  { id: 'r3', start: 'Gate 3', end: 'Seat Section 101', distance: 100, walkingTime: 2, accessible: false, crowdDensity: 10 }, // Avoid if wheelchair
  { id: 'r4', start: 'Gate 4', end: 'Seat Section 101', distance: 200, walkingTime: 4, accessible: true, crowdDensity: 40 },
];

export const getAllStadiumData = () => {
  return {
    gates: mockGates,
    facilities: mockFacilities,
    parking: mockParking,
    volunteers: mockVolunteers,
    incidents: mockIncidents,
    routes: mockRoutes
  };
};
