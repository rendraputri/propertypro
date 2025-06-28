import React from 'react';
import Layout from '../components/layout/Layout';
import { 
  Crown, 
  Star, 
  Image, 
  Calendar, 
  BarChart, 
  Eye, 
  Headphones, 
  Share2,
  TrendingUp,
  Users,
  MapPin,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const PremiumFeaturesPage: React.FC = () => {
  const features = [
    {
      icon: Star,
      title: 'Featured Placement',
      description: 'Your property appears at the top of search results, giving you maximum visibility.',
      benefits: ['3x more views', 'Higher click-through rates', 'Increased inquiries'],
      color: 'bg-blue-500'
    },
    {
      icon: Crown,
      title: 'Premium Badge & Styling',
      description: 'Stand out with a golden highlighted border and premium badge that catches attention.',
      benefits: ['Professional appearance', 'Builds trust', 'Distinguishes from competition'],
      color: 'bg-yellow-500'
    },
    {
      icon: Image,
      title: 'Extended Photo Gallery',
      description: 'Upload up to 20 high-quality images to showcase every detail of your property.',
      benefits: ['More comprehensive showcase', 'Better buyer engagement', 'Reduced need for physical visits'],
      color: 'bg-green-500'
    },
    {
      icon: Calendar,
      title: 'Extended Duration',
      description: 'Your listing stays active for 30 days instead of the standard 14 days.',
      benefits: ['Longer exposure time', 'Better ROI', 'More potential buyers'],
      color: 'bg-purple-500'
    },
    {
      icon: Eye,
      title: 'Virtual Tour Integration',
      description: 'Add 360° virtual tours and video walkthroughs to give buyers an immersive experience.',
      benefits: ['Remote viewing capability', 'Qualified leads', 'Modern presentation'],
      color: 'bg-indigo-500'
    },
    {
      icon: BarChart,
      title: 'Detailed Analytics',
      description: 'Track views, inquiries, favorites, and conversion rates with comprehensive insights.',
      benefits: ['Performance tracking', 'Optimization insights', 'ROI measurement'],
      color: 'bg-red-500'
    },
    {
      icon: Headphones,
      title: 'Priority Support',
      description: 'Get dedicated customer support with faster response times and priority assistance.',
      benefits: ['24/7 support access', 'Faster issue resolution', 'Dedicated account manager'],
      color: 'bg-teal-500'
    },
    {
      icon: Share2,
      title: 'Social Media Promotion',
      description: 'Your property gets promoted across our social media channels for additional exposure.',
      benefits: ['Wider reach', 'Social proof', 'Cross-platform visibility'],
      color: 'bg-pink-500'
    }
  ];

  const stats = [
    { number: '3.2x', label: 'More Views', description: 'Premium listings get significantly more visibility' },
    { number: '2.1x', label: 'Higher Inquiries', description: 'Better quality leads and more serious buyers' },
    { number: '85%', label: 'Faster Sales', description: 'Premium properties sell faster than standard listings' },
    { number: '30', label: 'Days Active', description: 'Extended listing duration for maximum exposure' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Property Owner',
      content: 'My premium listing got 5x more views and sold within 2 weeks. The analytics helped me understand buyer behavior.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Real Estate Agent',
      content: 'The virtual tour feature and premium placement made all the difference. Clients love the professional presentation.',
      rating: 5
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Property Investor',
      content: 'Priority support and detailed analytics give me the edge I need. Worth every penny for serious sellers.',
      rating: 5
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Premium Features | Properti Pro</title>
        <meta name="description" content="Discover premium features that boost your property visibility by 3x. Get featured placement, analytics, virtual tours, and priority support." />
        <meta name="keywords" content="premium property listing, featured placement, property analytics, virtual tours, real estate marketing" />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Crown size={64} className="text-yellow-200" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Premium Property Listing Features
            </h1>
            <p className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto">
              Boost your property visibility by 3x with our premium features. Get more views, 
              better leads, and sell faster with professional tools and enhanced exposure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-yellow-600 font-semibold py-4 px-8 rounded-lg hover:bg-yellow-50 transition-colors">
                Start Premium Listing
              </button>
              <button className="border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:text-yellow-600 transition-colors">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-yellow-600 mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-neutral-800 mb-2">{stat.label}</div>
                <div className="text-sm text-neutral-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">
              Everything You Need to Sell Faster
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Our premium features are designed to give your property maximum exposure 
              and help you connect with serious buyers quickly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-3">{feature.title}</h3>
                  <p className="text-neutral-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-sm text-neutral-700">
                        <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">
              How Premium Listing Works
            </h2>
            <p className="text-lg text-neutral-600">
              Get started with premium features in just a few simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-yellow-600">1</span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">Choose Premium</h3>
                <p className="text-neutral-600">
                  Select the premium upgrade option when creating or editing your property listing.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-yellow-600">2</span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">Secure Payment</h3>
                <p className="text-neutral-600">
                  Complete your payment securely through our Midtrans integration with multiple payment options.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-yellow-600">3</span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">Go Live</h3>
                <p className="text-neutral-600">
                  Your premium listing goes live immediately with enhanced features and top placement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">
              What Our Premium Users Say
            </h2>
            <p className="text-lg text-neutral-600">
              Real results from property owners who upgraded to premium
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-neutral-700 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-neutral-800">{testimonial.name}</div>
                  <div className="text-sm text-neutral-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-16 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Boost Your Property Visibility?
            </h2>
            <p className="text-xl text-yellow-100 mb-8">
              Join thousands of successful property sellers who chose premium listing. 
              Get 3x more views and sell faster with our enhanced features.
            </p>
            
            <div className="bg-white/10 rounded-lg p-6 mb-8">
              <div className="text-4xl font-bold mb-2">$29.99</div>
              <div className="text-yellow-100">per month • 30-day listing</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-yellow-600 font-semibold py-4 px-8 rounded-lg hover:bg-yellow-50 transition-colors flex items-center justify-center">
                <Crown size={20} className="mr-2" />
                Upgrade to Premium
              </button>
              <button className="border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:text-yellow-600 transition-colors flex items-center justify-center">
                View All Features
                <ArrowRight size={20} className="ml-2" />
              </button>
            </div>

            <div className="mt-8 text-sm text-yellow-100">
              <p>✓ 30-day money-back guarantee • ✓ Cancel anytime • ✓ No setup fees</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PremiumFeaturesPage;