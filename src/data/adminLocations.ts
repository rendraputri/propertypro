import { Location, LocationHierarchy } from '../types/admin';

export const adminLocations: Location[] = [
  // Provinces
  {
    id: 'p1',
    name: 'DKI Jakarta',
    type: 'province',
    slug: 'dki-jakarta',
    description: 'Ibu kota negara Indonesia dengan pusat bisnis dan pemerintahan',
    isActive: true,
    propertyCount: 3456,
    coordinates: { latitude: -6.2088, longitude: 106.8456 },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'p2',
    name: 'Jawa Barat',
    type: 'province',
    slug: 'jawa-barat',
    description: 'Provinsi dengan pertumbuhan ekonomi pesat di sekitar Jakarta',
    isActive: true,
    propertyCount: 2789,
    coordinates: { latitude: -6.9175, longitude: 107.6191 },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'p3',
    name: 'Bali',
    type: 'province',
    slug: 'bali',
    description: 'Destinasi wisata utama dengan properti investasi menarik',
    isActive: true,
    propertyCount: 1234,
    coordinates: { latitude: -8.3405, longitude: 115.0920 },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  
  // Cities - DKI Jakarta
  {
    id: 'c1',
    name: 'Jakarta Pusat',
    type: 'city',
    parentId: 'p1',
    slug: 'jakarta-pusat',
    description: 'Pusat bisnis dan pemerintahan Jakarta',
    isActive: true,
    propertyCount: 856,
    coordinates: { latitude: -6.1805, longitude: 106.8284 },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'c2',
    name: 'Jakarta Selatan',
    type: 'city',
    parentId: 'p1',
    slug: 'jakarta-selatan',
    description: 'Area premium dengan hunian mewah dan pusat perbelanjaan',
    isActive: true,
    propertyCount: 1245,
    coordinates: { latitude: -6.2615, longitude: 106.8106 },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'c3',
    name: 'Jakarta Barat',
    type: 'city',
    parentId: 'p1',
    slug: 'jakarta-barat',
    description: 'Kawasan industri dan perdagangan Jakarta',
    isActive: true,
    propertyCount: 678,
    coordinates: { latitude: -6.1352, longitude: 106.7511 },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  
  // Cities - Jawa Barat
  {
    id: 'c4',
    name: 'Bandung',
    type: 'city',
    parentId: 'p2',
    slug: 'bandung',
    description: 'Kota kreatif dengan iklim sejuk dan properti strategis',
    isActive: true,
    propertyCount: 987,
    coordinates: { latitude: -6.9175, longitude: 107.6191 },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'c5',
    name: 'Bogor',
    type: 'city',
    parentId: 'p2',
    slug: 'bogor',
    description: 'Kota hujan dengan hunian asri dan sejuk',
    isActive: true,
    propertyCount: 567,
    coordinates: { latitude: -6.5971, longitude: 106.8060 },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  
  // Districts - Jakarta Selatan
  {
    id: 'd1',
    name: 'Kebayoran Baru',
    type: 'district',
    parentId: 'c2',
    slug: 'kebayoran-baru',
    description: 'Kawasan bisnis dan hunian premium di Jakarta Selatan',
    isActive: true,
    propertyCount: 345,
    coordinates: { latitude: -6.2297, longitude: 106.7975 },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'd2',
    name: 'Pondok Indah',
    type: 'district',
    parentId: 'c2',
    slug: 'pondok-indah',
    description: 'Area elit dengan hunian mewah dan fasilitas lengkap',
    isActive: true,
    propertyCount: 234,
    coordinates: { latitude: -6.2659, longitude: 106.7844 },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'd3',
    name: 'Kemang',
    type: 'district',
    parentId: 'c2',
    slug: 'kemang',
    description: 'Kawasan lifestyle dengan apartemen dan hunian modern',
    isActive: true,
    propertyCount: 456,
    coordinates: { latitude: -6.2615, longitude: 106.8106 },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
];

export const buildLocationHierarchy = (locations: Location[]): LocationHierarchy[] => {
  const locationMap = new Map<string, LocationHierarchy>();
  const rootLocations: LocationHierarchy[] = [];

  // Create map of all locations
  locations.forEach(location => {
    locationMap.set(location.id, { ...location, children: [] });
  });

  // Build hierarchy
  locations.forEach(location => {
    const locationNode = locationMap.get(location.id)!;
    
    if (location.parentId) {
      const parent = locationMap.get(location.parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(locationNode);
        locationNode.parent = parent;
      }
    } else {
      rootLocations.push(locationNode);
    }
  });

  return rootLocations;
};