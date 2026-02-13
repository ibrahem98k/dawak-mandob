'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { Check, X, Plus } from 'lucide-react';

export function MedicineManager({ medicines, pharmacyId }: { medicines: any[], pharmacyId: number }) {
    const router = useRouter();
    const [newMedicine, setNewMedicine] = useState({ name: '', description: '', price: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAddMedicine = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/pharmacy/medicines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newMedicine,
                    price: parseFloat(newMedicine.price),
                    is_available: true
                }),
            });

            if (!res.ok) throw new Error('Failed to add medicine');

            setNewMedicine({ name: '', description: '', price: '' });
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleAvailability = async (id: number, currentStatus: boolean) => {
        try {
            await fetch(`/api/pharmacy/medicines/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_available: !currentStatus }),
            });
            router.refresh();
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    return (
        <div className="rounded-3xl p-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border border-white/20 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Manage Medicines</h2>

            {/* Add Medicine Form */}
            <form onSubmit={handleAddMedicine} className="mb-8 p-6 bg-white/30 dark:bg-slate-800/30 rounded-2xl border border-white/10 shadow-sm backdrop-blur-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Add New Medicine</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Input
                        placeholder="Medicine Name"
                        value={newMedicine.name}
                        onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                        required
                        className="bg-white/50 dark:bg-slate-800/50"
                    />
                    <Input
                        placeholder="Description (Optional)"
                        value={newMedicine.description}
                        onChange={(e) => setNewMedicine({ ...newMedicine, description: e.target.value })}
                        className="bg-white/50 dark:bg-slate-800/50"
                    />
                    <Input
                        placeholder="Price"
                        type="number"
                        step="0.01"
                        value={newMedicine.price}
                        onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })}
                        className="bg-white/50 dark:bg-slate-800/50"
                    />
                </div>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <Button type="submit" size="sm" isLoading={loading} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" /> Add Medicine
                </Button>
            </form>

            {/* Medicine List */}
            <div className="space-y-4">
                {medicines.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-white/20 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                        <p>No medicines added yet.</p>
                    </div>
                ) : (
                    medicines.map((medicine: any) => (
                        <div key={medicine.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/10 hover:shadow-lg transition-all duration-300">
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{medicine.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{medicine.description}</p>
                                {medicine.price && <p className="text-sm font-bold text-blue-500 mt-1">${medicine.price}</p>}
                            </div>

                            <button
                                onClick={() => toggleAvailability(medicine.id, medicine.is_available === 1)}
                                className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${medicine.is_available
                                    ? 'bg-green-100/80 text-green-700 hover:bg-green-200'
                                    : 'bg-red-100/80 text-red-700 hover:bg-red-200'
                                    }`}
                            >
                                {medicine.is_available ? (
                                    <><Check className="w-4 h-4" /> Available</>
                                ) : (
                                    <><X className="w-4 h-4" /> Out of Stock</>
                                )}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
