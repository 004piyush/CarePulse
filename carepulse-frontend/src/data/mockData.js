export const BED_STATUS = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  OCCUPIED: 'OCCUPIED',
  CLEANING: 'CLEANING',
};

export const WARD_TYPES = {
  ICU: 'ICU',
  GENERAL: 'GENERAL',
  ISOLATION: 'ISOLATION',
  PEDIATRIC: 'PEDIATRIC',
};

export const STATUS_COLORS = {
  [BED_STATUS.AVAILABLE]: 'bg-emerald-500 border-emerald-600',
  [BED_STATUS.RESERVED]: 'bg-amber-500 border-amber-600',
  [BED_STATUS.OCCUPIED]: 'bg-rose-500 border-rose-600',
  [BED_STATUS.CLEANING]: 'bg-blue-500 border-blue-600',
};

export const STATUS_BG_COLORS = {
  [BED_STATUS.AVAILABLE]: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  [BED_STATUS.RESERVED]: 'bg-amber-50 text-amber-800 border-amber-200',
  [BED_STATUS.OCCUPIED]: 'bg-rose-50 text-rose-800 border-rose-200',
  [BED_STATUS.CLEANING]: 'bg-blue-50 text-blue-800 border-blue-200',
};

export const STATUS_LABELS = {
  [BED_STATUS.AVAILABLE]: 'Available',
  [BED_STATUS.RESERVED]: 'Reserved',
  [BED_STATUS.OCCUPIED]: 'Occupied',
  [BED_STATUS.CLEANING]: 'Cleaning',
};

export const VALID_TRANSITIONS = {
  [BED_STATUS.AVAILABLE]: [BED_STATUS.RESERVED, BED_STATUS.OCCUPIED],
  [BED_STATUS.RESERVED]: [BED_STATUS.OCCUPIED, BED_STATUS.AVAILABLE],
  [BED_STATUS.OCCUPIED]: [BED_STATUS.CLEANING],
  [BED_STATUS.CLEANING]: [BED_STATUS.AVAILABLE],
};

export const generateMockBeds = () => {
  const beds = [];
  const wards = [
    { type: WARD_TYPES.ICU, prefix: 'ICU', count: 12 },
    { type: WARD_TYPES.GENERAL, prefix: 'GEN', count: 20 },
    { type: WARD_TYPES.ISOLATION, prefix: 'ISO', count: 8 },
    { type: WARD_TYPES.PEDIATRIC, prefix: 'PED', count: 10 },
  ];

  let id = 1;
  wards.forEach(({ type, prefix, count }) => {
    for (let i = 1; i <= count; i++) {
      const bedNum = i.toString().padStart(2, '0');
      const statuses = Object.values(BED_STATUS);
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      beds.push({
        id: id++,
        bedNumber: `${prefix}-BED-${bedNum}`,
        wardType: type,
        status: randomStatus,
        hasVentilator: type === WARD_TYPES.ICU && Math.random() > 0.3,
        hasOxygen: Math.random() > 0.2,
        patientId: randomStatus === BED_STATUS.OCCUPIED ? `PT-${1000 + id}` : null,
        patientName: randomStatus === BED_STATUS.OCCUPIED 
          ? ['John Doe', 'Jane Smith', 'Robert Brown', 'Emily Davis', 'Michael Johnson'][Math.floor(Math.random() * 5)]
          : null,
        lockedBy: null,
        lastUpdated: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      });
    }
  });
  
  return beds;
};

export const generateMockAuditLogs = () => {
  const logs = [];
  const actions = ['ALLOCATED', 'STATUS_CHANGED', 'RESERVED', 'RELEASED', 'CLEANING_STARTED', 'CLEANING_COMPLETED'];
  const users = ['Sarah Chen', 'Dr. James Wilson', 'Maria Rodriguez', 'Nurse Patel', 'Dr. Anderson'];
  
  for (let i = 0; i < 50; i++) {
    const timestamp = new Date(Date.now() - Math.random() * 7 * 86400000);
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    logs.push({
      id: i + 1,
      timestamp: timestamp.toISOString(),
      bedNumber: `ICU-BED-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}`,
      patientId: `PT-${1000 + Math.floor(Math.random() * 200)}`,
      action,
      performedBy: users[Math.floor(Math.random() * users.length)],
      statusTransition: action === 'STATUS_CHANGED' ? 'OCCUPIED → CLEANING' : null,
      notes: action === 'ALLOCATED' ? 'Emergency admission - ESI Level 2' : null,
    });
  }
  
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};