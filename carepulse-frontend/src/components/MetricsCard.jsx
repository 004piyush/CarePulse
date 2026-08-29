import React from 'react';
import { Bed, Activity, Wind, Users } from 'lucide-react';

const MetricCards = ({ beds, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-200 rounded"></div>
                <div className="h-8 w-16 bg-slate-200 rounded"></div>
              </div>
              <div className="h-12 w-12 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const totalICU = beds.filter(b => b.wardType === 'ICU').length;
  const availableICU = beds.filter(b => b.wardType === 'ICU' && b.status === 'AVAILABLE').length;
  const ventilatorBeds = beds.filter(b => b.hasVentilator);
  const occupiedVentilators = ventilatorBeds.filter(b => b.status === 'OCCUPIED').length;
  const ventilatorRate = ventilatorBeds.length > 0 
    ? Math.round((occupiedVentilators / ventilatorBeds.length) * 100) 
    : 0;
  const waitingTriage = beds.filter(b => b.status === 'RESERVED').length;

  const metrics = [
    {
      label: 'Total ICU Beds',
      value: totalICU,
      icon: Bed,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      iconBg: 'bg-indigo-100',
    },
    {
      label: 'Available ICU Beds',
      value: availableICU,
      icon: Activity,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      iconBg: 'bg-emerald-100',
    },
    {
      label: 'Ventilator Occupancy',
      value: `${ventilatorRate}%`,
      icon: Wind,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      iconBg: 'bg-amber-100',
    },
    {
      label: 'Patients Waiting',
      value: waitingTriage,
      icon: Users,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      iconBg: 'bg-rose-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <div 
          key={index} 
          className={`bg-white rounded-xl border p-6 transition-all hover:shadow-md ${metric.color}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">{metric.label}</p>
              <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${metric.iconBg}`}>
              <metric.icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricCards;