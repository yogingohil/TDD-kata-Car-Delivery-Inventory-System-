import React from 'react';
import { IPurchase } from '../types/index.js';

export const OrderTrackingModal: React.FC<{
  purchase: IPurchase;
  isOpen: boolean;
  onClose: () => void;
}> = ({ purchase, isOpen, onClose }) => {
  if (!isOpen) return null;

  const v = typeof purchase.vehicleId === 'object' ? purchase.vehicleId : null;

  const steps = [
    { title: 'Order Confirmed', date: new Date(purchase.purchasedAt).toLocaleDateString(), completed: true },
    { title: 'Pre-Delivery Inspection (PDI)', date: 'Completed (Pass)', completed: true },
    { title: 'En Route to Transporter Hub', date: 'In Progress', completed: true },
    { title: 'Out on Delivery Truck', date: 'Scheduled', completed: false },
    { title: 'Delivered to Customer', date: 'Estimated 2 Days', completed: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-lg w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-bold uppercase text-cyan-400">Live Delivery Tracking</span>
            <h3 className="text-lg font-bold text-white">
              {v ? `${v.make} ${v.model}` : 'Vehicle'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-sm">
            ✕
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 block">Order Ref:</span>
            <span className="font-mono text-cyan-400 font-bold">#{purchase._id.substring(18)}</span>
          </div>
          <div>
            <span className="text-slate-500 block">VIN:</span>
            <span className="font-mono text-slate-300">{v?.vin || 'N/A'}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block">Status:</span>
            <span className="text-emerald-400 font-bold">In Transit 🚚</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-6 pl-4 border-l-2 border-cyan-500/40 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <div
                className={`absolute -left-[23px] top-0 w-4 h-4 rounded-full border-2 ${
                  step.completed
                    ? 'bg-cyan-500 border-cyan-400 shadow-lg shadow-cyan-500/50'
                    : 'bg-slate-900 border-slate-700'
                }`}
              />
              <div className="ml-2">
                <h4 className={`text-sm font-bold ${step.completed ? 'text-white' : 'text-slate-500'}`}>
                  {step.title}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">{step.date}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 font-bold rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700"
        >
          Close Tracker
        </button>
      </div>
    </div>
  );
};
