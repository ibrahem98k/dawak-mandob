import type { Call, CallReport } from '../types';

const now = Date.now();

const MOCK_CALLS: Call[] = [
    {
        id: 'call-101',
        status: 'idle',
        receivedAt: now - 5 * 60 * 1000, // 5 min ago
        pharmacy: {
            id: 'pharma-001',
            name: 'Al-Hayat Pharmacy',
            doctorName: 'Dr. Ahmed Ali',
            address: '123 King Fahd Rd, Riyadh',
            phone: '+966 50 123 4567',
            latitude: 24.7136,
            longitude: 46.6753,
        },
    },
    {
        id: 'call-102',
        status: 'idle',
        receivedAt: now - 12 * 60 * 1000, // 12 min ago
        pharmacy: {
            id: 'pharma-002',
            name: 'Al-Dawaa Pharmacy',
            doctorName: 'Dr. Sara Hassan',
            address: '45 Olaya St, Riyadh',
            phone: '+966 55 987 6543',
            latitude: 24.6950,
            longitude: 46.6850,
        },
    },
    {
        id: 'call-103',
        status: 'idle',
        receivedAt: now - 25 * 60 * 1000, // 25 min ago
        pharmacy: {
            id: 'pharma-003',
            name: 'Nahdi Medical Pharmacy',
            doctorName: 'Dr. Khalid Nasser',
            address: '78 Tahlia St, Jeddah',
            phone: '+966 56 111 2222',
            latitude: 21.5433,
            longitude: 39.1728,
        },
    },
    {
        id: 'call-104',
        status: 'idle',
        receivedAt: now - 45 * 60 * 1000, // 45 min ago
        pharmacy: {
            id: 'pharma-004',
            name: 'Al-Amal Pharmacy',
            doctorName: 'Dr. Fatima Yousef',
            address: '12 Prince Sultan Rd, Dammam',
            phone: '+966 53 444 5555',
            latitude: 26.4207,
            longitude: 50.0888,
        },
    },
    {
        id: 'call-105',
        status: 'idle',
        receivedAt: now - 60 * 60 * 1000, // 1 hour ago
        pharmacy: {
            id: 'pharma-005',
            name: 'White Coat Pharmacy',
            doctorName: 'Dr. Omar Bakr',
            address: '99 Airport Rd, Riyadh',
            phone: '+966 50 777 8888',
            latitude: 24.7400,
            longitude: 46.7100,
        },
    },
];

export const api = {
    fetchAssignedCalls: async (): Promise<Call[]> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return MOCK_CALLS;
    },

    submitReport: async (report: CallReport): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('📝 FINAL REPORT SUBMITTED:', JSON.stringify(report, null, 2));
        return;
    },
};
