export type CallStatus = 'idle' | 'pending' | 'enroute' | 'resolution' | 'completed';

export interface Location {
    latitude: number;
    longitude: number;
}

export interface Pharmacy {
    id: string;
    name: string;
    doctorName: string;
    address: string;
    phone: string;
    latitude: number;
    longitude: number;
}

export interface Call {
    id: string;
    pharmacy: Pharmacy;
    status: CallStatus;
    receivedAt: number;
    acceptedAt?: number;
}

export type ResolutionType = 'success' | 'rejected' | 'postponed';

export interface CallReport {
    callId: string;
    resolution: ResolutionType;
    notes?: string;
    imageUrls?: string[];
    location: Location;
    timestamp: number;
    reason?: string; // For rejected
    followUpDate?: number; // For postponed
    pharmacyName?: string; // For daily report display
}

export interface DailyReport {
    date: string;
    reports: CallReport[];
    totalCalls: number;
    successCount: number;
    rejectedCount: number;
    postponedCount: number;
}
