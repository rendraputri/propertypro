import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { properties } from '../data/properties';
import { Property } from '../types';
import { 
  MapPin, 
  Calendar, 
  Heart, 
  Share2, 
  Printer, 
  Bed, 
  Bath, 
  Move,
  Home,
  Phone,
  Mail,
  CheckCircle
} from 'lucide-react';
import { formatPrice } from '../utils/formatter';
import { Helmet } from 'react-helmet-async';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isContactFormVisible, setIsContactFormVisible] = useState(false);
  
  useEffect(() => {
    if (id) {
      const foundProperty = properties.find(p => p.id === id);
      if (foundProperty) {
        setProperty(foundProperty);
        setActiveImage(foundProperty.images[0]);
      }
    }
    
    // Scroll to top when navigating to a property detail
    window.scrollTo(0, 0);
  }, [id]);
  
  if (!property) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="font-heading text-2xl font-bold mb-4">Properti Tidak Ditemukan</h2>
            <p className="mb-6">Maaf, properti yang Anda cari tidak ditemukan atau telah dihapus.</p>
            <Link to="/" className="btn-primary">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Helmet>
        <title>{`${property.title} | Properti Pro`}</title>
        <meta name="description" content={property.description.substring(0, 160)} />
        <meta name="keywords" content={`properti, ${property.type}, ${property.location.city}, ${property.purpose === 'jual' ? 'dijual' : 'disewa'}`} />
        <link rel="canonical" href={`https://propertipro.id/properti/${property.id}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://propertipro.id/properti/${property.id}`} />
        <meta property="og:title" content={property.title} />
        <meta property="og:description" content={property.description.substring(0, 160)} />
        <meta property="og:image" content={property.images[0]} />
      </Helmet>
      
      <div className="bg-neutral-100 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex text-sm mb-4">
            <Link to="/" className="text-primary hover:underline">Beranda</Link>
            <span className="mx-2 text-neutral-400">/</span>
            <Link 
              to={`/${property.purpose}`} 
              className="text-primary hover:underline"
            >
              {property.purpose === 'jual' ? 'Dijual' : 'Disewa'}
            </Link>
            <span className="mx-2 text-neutral-400">/</span>
            <span className="text-neutral-700 truncate">{property.title}</span>
          </nav>
          
          {/* Property Title Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium uppercase mb-2 ${property.purpose === 'jual' ? 'bg-primary text-white' : 'bg-success-500 text-white'}`}>
                  {property.purpose === 'jual' ? 'Dijual' : 'Disewa'}
                </span>
                <h1 className="font-heading font-bold text-2xl md:text-3xl text-accent">
                  {property.title}
                </h1>
                <div className="flex items-center mt-2 text-neutral-600">
                  <MapPin size={16} className="mr-1" />
                  <span>
                    {property.location.address}, {property.location.district}, {property.location.city}, {property.location.province}
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary">
                  {formatPrice(property.price, property.priceUnit)}
                  {property.purpose === 'sewa' && <span className="text-sm font-normal text-neutral-500">/bulan</span>}
                </h2>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-neutral-200">
              <div className="flex items-center text-neutral-600">
                <Calendar size={16} className="mr-1" />
                <span className="text-sm">
                  Dipasang: {new Date(property.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex gap-2 ml-auto">
                <button className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors" aria-label="Simpan properti">
                  <Heart size={18} />
                </button>
                <button className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors" aria-label="Bagikan properti">
                  <Share2 size={18} />
                </button>
                <button className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors" aria-label="Cetak properti">
                  <Printer size={18} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="h-[400px]">
                  <img 
                    src={activeImage} 
                    alt={property.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {property.images.map((img, index) => (
                    <div 
                      key={index}
                      className={`w-24 h-24 flex-shrink-0 cursor-pointer border-2 rounded overflow-hidden ${activeImage === img ? 'border-primary' : 'border-transparent'}`}
                      onClick={() => setActiveImage(img)}
                    >
                      <img 
                        src={img} 
                        alt={`${property.title} - Gambar ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Property Details */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="font-heading font-semibold text-xl mb-4">Detail Properti</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col items-center justify-center p-4 bg-neutral-50 rounded-lg">
                    <Bed size={24} className="text-primary mb-2" />
                    <span className="text-sm text-neutral-500">Kamar Tidur</span>
                    <span className="font-semibold">{property.bedrooms || '-'}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-neutral-50 rounded-lg">
                    <Bath size={24} className="text-primary mb-2" />
                    <span className="text-sm text-neutral-500">Kamar Mandi</span>
                    <span className="font-semibold">{property.bathrooms || '-'}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-neutral-50 rounded-lg">
                    <Move size={24} className="text-primary mb-2" />
                    <span className="text-sm text-neutral-500">Luas Bangunan</span>
                    <span className="font-semibold">{property.buildingSize ? `${property.buildingSize} m²` : '-'}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-neutral-50 rounded-lg">
                    <Home size={24} className="text-primary mb-2" />
                    <span className="text-sm text-neutral-500">Luas Tanah</span>
                    <span className="font-semibold">{property.landSize ? `${property.landSize} m²` : '-'}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-heading font-semibold text-lg mb-2">Deskripsi</h3>
                  <p className="text-neutral-700 whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
                
                {property.features.length > 0 && (
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-2">Fasilitas & Fitur</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {property.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle size={16} className="text-primary mr-2" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Location */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="font-heading font-semibold text-xl mb-4">Lokasi</h2>
                <div className="bg-neutral-100 h-60 flex items-center justify-center rounded mb-4">
                  <div className="text-center">
                    <MapPin size={32} className="mx-auto mb-2 text-primary" />
                    <p>Peta Lokasi</p>
                  </div>
                </div>
                <p className="text-neutral-700">
                  <span className="font-medium">Alamat:</span> {property.location.address}, {property.location.district}, {property.location.city}, {property.location.province} {property.location.postalCode && `${property.location.postalCode}`}
                </p>
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              {/* Agent Card */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <img 
                      src={property.agent.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'} 
                      alt={property.agent.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold">{property.agent.name}</h3>
                    <p className="text-sm text-neutral-500">{property.agent.company}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <a 
                    href={`tel:${property.agent.phone}`} 
                    className="flex items-center justify-center gap-2 bg-primary text-white font-medium py-2 px-4 rounded-lg w-full hover:bg-primary/90 transition-colors"
                  >
                    <Phone size={18} />
                    <span>{property.agent.phone}</span>
                  </a>
                  <a 
                    href={`mailto:${property.agent.email}`} 
                    className="flex items-center justify-center gap-2 bg-white text-primary border border-primary font-medium py-2 px-4 rounded-lg w-full hover:bg-primary/5 transition-colors"
                  >
                    <Mail size={18} />
                    <span>Email</span>
                  </a>
                </div>
                
                <button 
                  className="w-full text-center text-primary hover:underline"
                  onClick={() => setIsContactFormVisible(!isContactFormVisible)}
                >
                  {isContactFormVisible ? 'Tutup Form' : 'Kirim Pesan'}
                </button>
                
                {isContactFormVisible && (
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <form>
                      <div className="mb-3">
                        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                          Nama
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="Nama lengkap Anda"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="Email Anda"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                          Telepon
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="Nomor telepon Anda"
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                          Pesan
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="Saya tertarik dengan properti ini. Mohon informasi lebih lanjut."
                          defaultValue="Saya tertarik dengan properti ini. Mohon informasi lebih lanjut."
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full btn-primary"
                      >
                        Kirim Pesan
                      </button>
                    </form>
                  </div>
                )}
              </div>
              
              {/* Similar Properties */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-heading font-semibold text-lg mb-4">Properti Serupa</h3>
                
                <div className="space-y-4">
                  {properties
                    .filter(p => 
                      p.id !== property.id && 
                      p.type === property.type && 
                      p.purpose === property.purpose
                    )
                    .slice(0, 3)
                    .map(similarProperty => (
                      <Link 
                        key={similarProperty.id} 
                        to={`/properti/${similarProperty.id}`}
                        className="flex gap-3 group"
                      >
                        <div className="w-24 h-20 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={similarProperty.images[0]} 
                            alt={similarProperty.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                            {similarProperty.title}
                          </h4>
                          <p className="text-primary font-semibold text-sm">
                            {formatPrice(similarProperty.price, similarProperty.priceUnit)}
                          </p>
                        </div>
                      </Link>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PropertyDetailPage;