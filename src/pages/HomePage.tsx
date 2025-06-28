import React from 'react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/home/HeroSection';
import PropertyTypes from '../components/home/PropertyTypes';
import FeaturedProperties from '../components/home/FeaturedProperties';
import PopularLocations from '../components/home/PopularLocations';
import CallToAction from '../components/home/CallToAction';
import { Helmet } from 'react-helmet-async';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Properti Pro - Jual Beli & Sewa Properti di Indonesia</title>
        <meta 
          name="description" 
          content="Properti Pro adalah platform jual beli dan sewa properti terpercaya di Indonesia. Temukan rumah, apartemen, ruko, dan properti lainnya dengan mudah."
        />
        <meta name="keywords" content="properti, rumah, apartemen, jual beli properti, sewa properti, properti indonesia" />
        <link rel="canonical" href="https://propertipro.id" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://propertipro.id/" />
        <meta property="og:title" content="Properti Pro - Jual Beli & Sewa Properti di Indonesia" />
        <meta property="og:description" content="Properti Pro adalah platform jual beli dan sewa properti terpercaya di Indonesia. Temukan rumah, apartemen, ruko, dan properti lainnya dengan mudah." />
        <meta property="og:image" content="https://propertipro.id/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://propertipro.id/" />
        <meta property="twitter:title" content="Properti Pro - Jual Beli & Sewa Properti di Indonesia" />
        <meta property="twitter:description" content="Properti Pro adalah platform jual beli dan sewa properti terpercaya di Indonesia. Temukan rumah, apartemen, ruko, dan properti lainnya dengan mudah." />
        <meta property="twitter:image" content="https://propertipro.id/og-image.jpg" />
      </Helmet>
      
      <HeroSection />
      <PropertyTypes />
      <FeaturedProperties />
      <PopularLocations />
      <CallToAction />
    </Layout>
  );
};

export default HomePage;