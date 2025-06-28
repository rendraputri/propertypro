export interface Province {
  id: string;
  name: string;
}

export interface City {
  id: string;
  provinceId: string;
  name: string;
}

export interface District {
  id: string;
  cityId: string;
  name: string;
}

export const provinces: Province[] = [
  { id: 'p1', name: 'DKI Jakarta' },
  { id: 'p2', name: 'Jawa Barat' },
  { id: 'p3', name: 'Jawa Tengah' },
  { id: 'p4', name: 'Jawa Timur' },
  { id: 'p5', name: 'Banten' },
  { id: 'p6', name: 'Bali' },
  { id: 'p7', name: 'Sumatera Utara' },
  { id: 'p8', name: 'Sumatera Selatan' },
];

export const cities: City[] = [
  { id: 'c1', provinceId: 'p1', name: 'Jakarta Pusat' },
  { id: 'c2', provinceId: 'p1', name: 'Jakarta Selatan' },
  { id: 'c3', provinceId: 'p1', name: 'Jakarta Barat' },
  { id: 'c4', provinceId: 'p1', name: 'Jakarta Timur' },
  { id: 'c5', provinceId: 'p1', name: 'Jakarta Utara' },
  { id: 'c6', provinceId: 'p2', name: 'Bandung' },
  { id: 'c7', provinceId: 'p2', name: 'Bogor' },
  { id: 'c8', provinceId: 'p2', name: 'Depok' },
  { id: 'c9', provinceId: 'p2', name: 'Bekasi' },
  { id: 'c10', provinceId: 'p3', name: 'Semarang' },
  { id: 'c11', provinceId: 'p4', name: 'Surabaya' },
  { id: 'c12', provinceId: 'p5', name: 'Tangerang' },
  { id: 'c13', provinceId: 'p5', name: 'Tangerang Selatan' },
  { id: 'c14', provinceId: 'p6', name: 'Denpasar' },
  { id: 'c15', provinceId: 'p7', name: 'Medan' },
  { id: 'c16', provinceId: 'p8', name: 'Palembang' },
];

export const districts: District[] = [
  { id: 'd1', cityId: 'c1', name: 'Tanah Abang' },
  { id: 'd2', cityId: 'c1', name: 'Menteng' },
  { id: 'd3', cityId: 'c2', name: 'Kebayoran Baru' },
  { id: 'd4', cityId: 'c2', name: 'Pondok Indah' },
  { id: 'd5', cityId: 'c2', name: 'Kemang' },
  { id: 'd6', cityId: 'c5', name: 'Kelapa Gading' },
  { id: 'd7', cityId: 'c6', name: 'Dago' },
  { id: 'd8', cityId: 'c12', name: 'Gading Serpong' },
  { id: 'd9', cityId: 'c13', name: 'Bintaro' },
  { id: 'd10', cityId: 'c13', name: 'BSD City' },
  { id: 'd11', cityId: 'c11', name: 'Gubeng' },
  { id: 'd12', cityId: 'c14', name: 'Kuta' },
  { id: 'd13', cityId: 'c15', name: 'Medan Selayang' },
];