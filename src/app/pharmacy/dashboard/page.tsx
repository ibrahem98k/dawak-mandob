import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { ProfileManager } from '@/components/dashboard/ProfileManager';
import { MedicineManager } from '@/components/dashboard/MedicineManager';

export default async function DashboardPage() {
    const user = await getSession();

    if (!user || user.role !== 'pharmacy-owner') {
        redirect('/pharmacy/login');
    }

    const pharmacy = db.prepare('SELECT * FROM pharmacies WHERE user_id = ?').get(user.userId) as any;

    if (!pharmacy) {
        // Should not happen if registered correctly, but handle it
        return <div>Error loading pharmacy profile</div>;
    }

    const medicines = db.prepare('SELECT * FROM medicines WHERE pharmacy_id = ?').all(pharmacy.id) as any[];

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Pharmacy Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile */}
                <div className="lg:col-span-1">
                    <ProfileManager pharmacy={pharmacy} />
                </div>

                {/* Right Column: Medicines */}
                <div className="lg:col-span-2">
                    <MedicineManager medicines={medicines} pharmacyId={pharmacy.id} />
                </div>
            </div>
        </div>
    );
}
