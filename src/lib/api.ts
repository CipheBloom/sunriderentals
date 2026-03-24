const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Generic fetch wrapper
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    console.error(`❌ API Error: ${response.status} ${url}`);
    
    // Try to get error details from response
    const errorText = await response.text();
    console.error(`❌ Error response body:`, errorText);
    
    throw new Error(`API Error: ${response.status}`);
  }

  const text = await response.text();
  
  try {
    const json = JSON.parse(text);
    console.log(`✅ API Response: ${options.method || 'GET'} ${url}`, json);
    return json;
  } catch (parseError) {
    console.error(`❌ JSON parse error for ${url}:`, parseError);
    console.error(`❌ Raw response that failed to parse:`, text);
    
    // Check if response is HTML (error page)
    if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
      console.error(`❌ Server returned HTML instead of JSON for ${url}`);
      throw new Error(`Server Error: HTML response instead of JSON`);
    }
    
    throw new Error(`JSON.parse: unexpected character at line 1 column 1 of JSON data`);
  }
}

// === USER API ===
export interface UserData {
  id: string;
  name: string;
  email: string;
  picture?: string;
  phone?: string;
  address?: string;
  isRider?: boolean;
  riderApprovedAt?: string;
  createdAt?: string;
}

export const userAPI = {
  // GET all users
  getAll: () => fetchAPI('/users'),

  // GET single user by ID
  getById: (id: string) => fetchAPI(`/users/${id}`),

  // GET single user by email
  getByEmail: (email: string) => fetchAPI(`/users/email/${encodeURIComponent(email)}`),

  // POST new user (sync on login)
  create: (data: UserData) => {
    console.log('🔄 Creating new user in MongoDB:', data);
    return fetchAPI('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT update user profile
  update: (id: string, data: Partial<UserData>) => {
    console.log('🔄 Updating user in MongoDB:', { id, data });
    return fetchAPI(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE user
  delete: (id: string) => {
    console.log('🔄 Deleting user from MongoDB:', id);
    return fetchAPI(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// === BOOKING API ===
export interface BookingData {
  id: string;
  userId: string;
  vehicleId: string;
  vehicleName?: string;
  startDate: Date | string;
  endDate: Date | string;
  totalPrice?: number;
  status?: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  // Admin enriched fields
  userName?: string;
  userEmail?: string;
  userPhone?: string;
}

export const bookingAPI = {
  // GET all bookings
  getAll: (userID: string) => fetchAPI(`/bookings/${userID}`),

  // GET user bookings
  getByUser: (userId: string) => fetchAPI(`/bookings/user/${userId}`),

  // POST new booking
  create: (data: BookingData) =>
    fetchAPI('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // PUT update booking
  update: (id: string, data: Partial<BookingData>) =>
    fetchAPI(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // DELETE booking
  delete: (id: string) =>
    fetchAPI(`/bookings/${id}`, {
      method: 'DELETE',
    }),
};

// === ADMIN API ===
export interface AdminStats {
  totalBookings: number;
  totalUsers: number;
  totalVehicles: number;
  activeBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  totalRevenue: number;
}

export interface VehicleData {
  id: string;
  name: string;
  category: string;
  pricePerDay: number;
  riderPricePerDay?: number; // Discounted price for approved riders
  image: string;
  description: string;
  features: string[];
  specs: {
    engine: string;
    power: string;
    mileage: string;
    fuelCapacity: string;
    weight?: string;
    maxSpeed?: string;
  };
  available: boolean;
  rating?: number;
  isNew?: boolean;
}

export const adminAPI = {
  // Login
  login: (email: string, password: string) =>
    fetchAPI('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Get all bookings
  getAllBookings: () => fetchAPI('/bookings'),

  // Get all users
  getAllUsers: () => fetchAPI('/users'),

  // Get all vehicles
  getAllVehicles: () => fetchAPI('/vehicles'),

  // Update vehicle availability
  updateVehicleAvailability: (id: string, available: boolean) =>
    fetchAPI(`/vehicles/${id}/availability`, {
      method: 'PUT',
      body: JSON.stringify({ available }),
    }),

  // Update full vehicle details
  updateVehicle: (id: string, data: Partial<VehicleData>) =>
    fetchAPI(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Create new vehicle
  createVehicle: (data: VehicleData) =>
    fetchAPI('/vehicles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Delete vehicle
  deleteVehicle: (id: string) =>
    fetchAPI(`/vehicles/${id}`, {
      method: 'DELETE',
    }),

  // Update booking status
  updateBookingStatus: (id: string, status: string) =>
    fetchAPI(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // Delete booking
  deleteBooking: (id: string) =>
    fetchAPI(`/bookings/${id}`, {
      method: 'DELETE',
    }),

  // Get stats
  getStats: () => fetchAPI('/stats') as Promise<AdminStats>,

  // === RIDER APPLICATION ROUTES (Admin) ===
  // Get all rider applications
  getAllRiderApplications: () => fetchAPI('/rider-applications'),

  // Update rider application status
  updateRiderApplicationStatus: (id: string, status: string, adminNotes?: string) =>
    fetchAPI(`/rider-applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, adminNotes }),
    }),

  // Delete rider application
  deleteRiderApplication: (id: string) =>
    fetchAPI(`/rider-applications/${id}`, {
      method: 'DELETE',
    }),

  // Update user rider status
  updateUserRiderStatus: (userId: string, isRider: boolean) =>
    fetchAPI(`/users/${userId}/rider-status`, {
      method: 'PUT',
      body: JSON.stringify({ isRider }),
    }),
};

// === RIDER APPLICATION API (Public) ===
export interface RiderApplicationData {
  id?: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  // Personal identification
  aadharNumber: string;
  panNumber: string;
  // Application details
  fullName: string;
  age: number;
  city: string;
  vehicleType: string;
  hasLicense: boolean;
  licenseNumber?: string;
  experience?: string;
  preferredWorkArea?: string;
  availability?: string;
  additionalInfo?: string;
  status?: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt?: string;
}

export const riderApplicationAPI = {
  // Create new application
  create: (data: RiderApplicationData) =>
    fetchAPI('/rider-applications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  // Get user's own application
  getByUserId: (userId: string) =>
    fetchAPI(`/rider-applications?userId=${userId}`) as Promise<RiderApplicationData>,
};

// === PUBLIC VEHICLE API ===
export const vehicleAPI = {
  // Get all available vehicles (for public scooty page)
  getAvailable: () => fetchAPI('/vehicles') as Promise<VehicleData[]>,
};

export const healthAPI = {
  check: () => fetchAPI('/health'),
};

// Usage examples:
/*
import { userAPI, bookingAPI, healthAPI } from './api';

// Sync user on login (create if not exists)
await userAPI.create({
  id: "google_123",
  name: "Yougraj",
  email: "yougraj@gmail.com",
  picture: "https://..."
});

// Update profile
await userAPI.update("google_123", { phone: "+91...", address: "..." });

// Create booking
await bookingAPI.create({
  id: "booking_" + Date.now(),
  userId: "google_123",
  vehicleId: "scooty-001",
  vehicleName: "Honda Activa",
  startDate: new Date(),
  endDate: new Date(Date.now() + 86400000),
  totalPrice: 500,
  status: "pending"
});

// Get user's bookings
const myBookings = await bookingAPI.getByUser("google_123");

// Update booking status
await bookingAPI.update("booking_123", { status: "confirmed" });

// Cancel/delete booking
await bookingAPI.delete("booking_123");
*/
