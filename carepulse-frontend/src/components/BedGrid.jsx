import React from 'react';
import { useAuth, ROLES } from '../context/AuthContext';
import { 
  Wind, 
  Droplets, 
  User, 
  Clock, 
  ArrowRight,
  Stethoscope,
  Shield
} from 'lucide-react';
import { STATUS_COLORS, STATUS_BG_COLORS, STATUS_LABELS, VALID_TRANSITIONS, BED_STATUS } from '../data/mockData';

const BedGrid = ({ beds, isLoading, onAllocate, onStatusChange }) => {
  const { user, hasRole } = useAuth();

  const getValidNextStatuses = (currentStatus) => {
    return VALID_TRANSITIONS[currentStatus] || [];
  };

  const getActionButton = (bed) => {
    // Triage Nurse: Can reserve available beds
    if (hasRole(ROLES.TRIAGE) && bed.status === BED_STATUS.AVAILABLE) {
      return (
        <button
          onClick={() => onAllocate(bed)}
          className="w-full mt-3 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
        >
          <Stethoscope className="w-3.5 h-3.5" />
          Reserve for Patient
        </button>
      );
    }

    // ICU Manager: Can change status
    if (hasRole(ROLES.ICU_MANAGER)) {
      const nextStatuses = getValidNextStatuses(bed.status);
      
      if (nextStatuses.length === 0) return null;

      return (
        <div className="mt-3 relative group">
          <select
            onChange={(e) => {
              if (e.target.value) {
                onStatusChange(bed, e.target.value);
                e.target.value = '';
              }
            }}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none"
            defaultValue=""
          >
            <option value="" disabled>Change Status...</option>
            {nextStatuses.map(status => (
              <option key={status} value={status}>
                Mark as {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
          <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      );
    }

    // Admin: Can do anything
    if (hasRole(ROLES.ADMIN)) {
      return (
        <div className="mt-3 flex gap-2">
          {bed.status === BED_STATUS.AVAILABLE && (
            <button
              onClick={() => onAllocate(bed)}
              className="flex-1 py-2 px-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Allocate
            </button>
          )}
          <div className="flex-1 relative">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  onStatusChange(bed, e.target.value);
                  e.target.value = '';
                }
              }}
              className="w-full py-2 px-2 bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none"
              defaultValue=""
            >
              <option value="" disabled>Status</option>
              {Object.values(BED_STATUS)
                .filter(s => s !== bed.status)
                .map(status => (
                  <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                ))}
            </select>
          </div>
        </div>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="h-5 w-24 bg-slate-200 rounded"></div>
              <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-200 rounded"></div>
              <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (beds.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <Bed className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-slate-700">No beds found</h3>
        <p className="text-sm text-slate-500">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {beds.map((bed) => (
        <div 
          key={bed.id} 
          className={`
            relative bg-white rounded-xl border-2 p-5 transition-all hover:shadow-lg
            ${bed.lockedBy ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200 hover:border-indigo-200'}
          `}
        >
          {/* Lock Warning Banner */}
          {bed.lockedBy && (
            <div className="absolute -top-2 left-4 px-2 py-0.5 bg-amber-100 border border-amber-300 rounded text-[10px] font-bold text-amber-800 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Locked by {bed.lockedBy}
            </div>
          )}

          {/* Header: Bed Number + Status Badge */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{bed.bedNumber}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{bed.wardType} Ward</p>
            </div>
            <span className={`
              inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border
              ${STATUS_BG_COLORS[bed.status]}
            `}>
              {STATUS_LABELS[bed.status]}
            </span>
          </div>

          {/* Equipment Badges */}
          <div className="flex gap-2 mb-3">
            {bed.hasVentilator && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-semibold border border-slate-200">
                <Wind className="w-3 h-3" />
                Ventilator
              </span>
            )}
            {bed.hasOxygen && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-sky-50 text-sky-600 rounded-md text-[10px] font-semibold border border-sky-200">
                <Droplets className="w-3 h-3" />
                O₂
              </span>
            )}
          </div>

          {/* Patient Info (if occupied/reserved) */}
          {(bed.status === BED_STATUS.OCCUPIED || bed.status === BED_STATUS.RESERVED) && (
            <div className="bg-slate-50 rounded-lg p-3 mb-3 border border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-700">{bed.patientName || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {bed.patientId}
                </span>
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-2">
            <Clock className="w-3 h-3" />
            Updated {new Date(bed.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>

          {/* Role-Based Action Buttons */}
          {getActionButton(bed)}
        </div>
      ))}
    </div>
  );
};

export default BedGrid;