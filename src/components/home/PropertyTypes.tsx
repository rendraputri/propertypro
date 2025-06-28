import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Building2, Building, MapPin, Warehouse } from 'lucide-react';

interface PropertyTypeItemProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  link: string;
}

const PropertyTypeItem: React.FC<PropertyTypeItemProps> = ({ icon, title, count, link }) => {
  return (
    <Link to={link} className="card flex items-center p-4 hover:border-primary group">
      <div className="bg-primary/10 p-3 rounded-full mr-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="font-heading font-semibold text-accent group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-neutral-500">
          {count} properti
        </p>
      </div>
    </Link>
  );
};

const PropertyTypes: React.FC = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-accent mb-2">
            Jelajahi Berdasarkan Tipe Properti
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Temukan properti yang sesuai dengan kebutuhan Anda dari berbagai pilihan tipe properti
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <PropertyTypeItem 
            icon={<Home size={24} />} 
            title="Rumah" 
            count={5432} 
            link="/jual?type=rumah" 
          />
          <PropertyTypeItem 
            icon={<Building2 size={24} />} 
            title="Apartemen" 
            count={2154} 
            link="/jual?type=apartemen" 
          />
          <PropertyTypeItem 
            icon={<MapPin size={24} />} 
            title="Tanah" 
            count={1278} 
            link="/jual?type=tanah" 
          />
          <PropertyTypeItem 
            icon={<Building size={24} />} 
            title="Ruko" 
            count={864} 
            link="/jual?type=ruko" 
          />
          <PropertyTypeItem 
            icon={<Building2 size={24} />} 
            title="Kondominium" 
            count={532} 
            link="/jual?type=kondominium" 
          />
          <PropertyTypeItem 
            icon={<Building size={24} />} 
            title="Gedung Komersial" 
            count={321} 
            link="/jual?type=gedung-komersial" 
          />
          <PropertyTypeItem 
            icon={<Warehouse size={24} />} 
            title="Ruang Industri" 
            count={189} 
            link="/jual?type=ruang-industri" 
          />
          <PropertyTypeItem 
            icon={<Home size={24} />} 
            title="Properti Lainnya" 
            count={423} 
            link="/jual?type=lainnya" 
          />
        </div>
      </div>
    </section>
  );
};

export default PropertyTypes;