import React from 'react';
import { Search, Filter, Wind, Droplets } from 'lucide-react';
import { BED_STATUS, WARD_TYPES } from '../data/mockData';

const FilterBar = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Bed Number or Patient ID..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Ward Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filters.wardType}
            onChange={(e) => onFilterChange('wardType', e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Wards</option>
            {Object.values(WARD_TYPES).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Statuses</option>
          {Object.values(BED_STATUS).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        {/* Equipment Toggles */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={filters.hasVentilator}
              onChange={(e) => onFilterChange('hasVentilator', e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <Wind className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">Ventilator</span>
          </label>

          <label className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={filters.hasOxygen}
              onChange={(e) => onFilterChange('hasOxygen', e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <Droplets className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">Oxygen</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;