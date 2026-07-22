import React, { useState } from 'react';
import { IVehicle } from '../types/index.js';
import { apiClient } from '../services/api.js';
import { useUIStore } from '../store/uiStore.js';

export const TestDriveModal: React.FC<{
  vehicle: IVehicle;
  isOpen: boolean;
  onClose: () => void;
}> = ({ vehicle, isOpen, onClose }) => {
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('10:00 AM - 11:00 AM');
  const [type, setType] = useState<'SHOWROOM_VISIT' | 'HOME_DELIVERY'>('SHOWROOM_VISIT');
  const [locationAddress, setLocationAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const { addToast } = useUIStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/test-drives', {
        vehicleId: vehicle._id,
        preferredDate,
        preferredTimeSlot,
        type,
        locationAddress,
        contactPhone,
      });
      addToast('Test drive appointment scheduled successfully!', 'success');
      onClose();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to schedule test drive', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white">Book a Test Drive</h3>
          <p className="text-xs text-slate-400">
            {vehicle.make} {vehicle.model} ({vehicle.year})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Test Drive Experience
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
            >
              <option value="SHOWROOM_VISIT">Showroom Visit</option>
              <option value="HOME_DELIVERY">VIP Home Delivery Test Drive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Preferred Date
            </label>
            <input
              type="date"
              required
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Time Slot
            </label>
            <select
              value={preferredTimeSlot}
              onChange={(e) => setPreferredTimeSlot(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
            >
              <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
              <option value="01:00 PM - 02:00 PM">01:00 PM - 02:00 PM</option>
              <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
            </select>
          </div>

          {type === 'HOME_DELIVERY' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Delivery Address
              </label>
              <input
                type="text"
                required
                placeholder="Full delivery street address"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Contact Phone Number
            </label>
            <input
              type="tel"
              required
              placeholder="+1 (555) 000-1234"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 font-semibold rounded-xl bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 font-bold rounded-xl text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Confirm Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
