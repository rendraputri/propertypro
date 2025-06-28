import React, { useState, useEffect } from 'react';
import { Search, MapPin, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { provinces, cities, districts } from '../../data/locations';

interface SearchBoxProps {
  variant?: 'hero' | 'compact';
}

const SearchBox: React.FC<SearchBoxProps> = ({ variant = 'hero' }) => {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState<'jual' | 'sewa'>('jual');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedType, setSelectedType] = useState('');
  
  const [filteredCities, setFilteredCities] = useState(cities);
  const [filteredDistricts, setFilteredDistricts] = useState(districts);

  useEffect(() => {
    if (selectedProvince) {
      setFilteredCities(cities.filter(city => city.provinceId === selectedProvince));
      setSelectedCity('');
      setSelectedDistrict('');
    } else {
      setFilteredCities(cities);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedCity) {
      setFilteredDistricts(districts.filter(district => district.cityId === selectedCity));
      setSelectedDistrict('');
    } else {
      setFilteredDistricts(districts);
    }
  }, [selectedCity]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    params.append('purpose', purpose);
    if (selectedProvince) params.append('province', selectedProvince);
    if (selectedCity) params.append('city', selectedCity);
    if (selectedDistrict) params.append('district', selectedDistrict);
    if (selectedType) params.append('type', selectedType);
    
    navigate(`/${purpose}?${params.toString()}`);
  };

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <form onSubmit={handleSearch}>
          <div className="flex flex-wrap gap-2">
            <div className="w-full flex rounded-lg overflow-hidden">
              <button
                type="button"
                className={`px-4 py-2 font-medium ${purpose === 'jual' ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-700'}`}
                onClick={() => setPurpose('jual')}
              >
                Jual
              </button>
              <button
                type="button"
                className={`px-4 py-2 font-medium ${purpose === 'sewa' ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-700'}`}
                onClick={() => setPurpose('sewa')}
              >
                Sewa
              </button>
            </div>
            
            <div className="w-full">
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                <select
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                >
                  <option value="">Pilih Provinsi</option>
                  {provinces.map(province => (
                    <option key={province.id} value={province.id}>{province.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full btn-primary flex items-center justify-center"
            >
              <Search size={18} className="mr-2" />
              Cari Properti
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSearch}>
        <div className="mb-4 flex rounded-lg overflow-hidden">
          <button
            type="button"
            className={`flex-1 px-4 py-2 font-medium text-center ${purpose === 'jual' ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-700'} transition-colors`}
            onClick={() => setPurpose('jual')}
          >
            Dijual
          </button>
          <button
            type="button"
            className={`flex-1 px-4 py-2 font-medium text-center ${purpose === 'sewa' ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-700'} transition-colors`}
            onClick={() => setPurpose('sewa')}
          >
            Disewa
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            <select
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
            >
              <option value="">Pilih Provinsi</option>
              {provinces.map(province => (
                <option key={province.id} value={province.id}>{province.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            <select
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedProvince}
            >
              <option value="">Pilih Kota/Kabupaten</option>
              {filteredCities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            <select
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedCity}
            >
              <option value="">Pilih Kecamatan</option>
              {filteredDistricts.map(district => (
                <option key={district.id} value={district.id}>{district.name}</option>
              ))}
            </select>
          </div>

          <div className="relative lg:col-span-3">
            <Home size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            <select
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Semua Tipe Properti</option>
              <option value="rumah">Rumah</option>
              <option value="apartemen">Apartemen</option>
              <option value="ruko">Ruko</option>
              <option value="tanah">Tanah</option>
              <option value="gedung-komersial">Gedung Komersial</option>
              <option value="ruang-industri">Ruang Industri</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full btn-primary flex items-center justify-center py-3"
        >
          <Search size={20} className="mr-2" />
          Cari Properti
        </button>
      </form>
    </div>
  );
};

export default SearchBox;