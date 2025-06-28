import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { User, Mail, Phone, Building, MapPin, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileFormData {
  full_name: string;
  phone: string;
  company: string;
  address: string;
  avatar_url: string;
}

const UserProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    phone: '',
    company: '',
    address: '',
    avatar_url: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        phone: user.phone || '',
        company: user.company || '',
        address: '', // This would come from user data if available
        avatar_url: user.avatar_url || '',
      });
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload this to storage
      // For now, we'll create a local URL
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, avatar_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // Only update fields that are in the user_profiles table
      const updates = {
        full_name: formData.full_name,
        phone: formData.phone,
        company: formData.company,
        avatar_url: formData.avatar_url,
      };
      
      await updateProfile(updates);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setErrorMessage(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getUserProfile = async () => {
    // This function would be used to fetch the user profile
    // It's already implemented in the AuthContext
    console.log('Getting user profile...');
  };
  
  return (
    <>
      <Helmet>
        <title>My Profile | User Area</title>
        <meta name="description" content="View and edit your profile information" />
      </Helmet>
      
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">My Profile</h1>
          <p className="text-neutral-600">
            View and update your personal information
          </p>
        </div>
        
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 flex items-start">
            <CheckCircle size={20} className="mr-3 flex-shrink-0 mt-0.5" />
            <p>{successMessage}</p>
          </div>
        )}
        
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start">
            <AlertCircle size={20} className="mr-3 flex-shrink-0 mt-0.5" />
            <p>{errorMessage}</p>
          </div>
        )}
        
        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-neutral-200 mb-3">
                  {formData.avatar_url ? (
                    <img 
                      src={formData.avatar_url} 
                      alt={formData.full_name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={48} className="text-neutral-400" />
                    </div>
                  )}
                </div>
                <label className="btn-secondary text-sm cursor-pointer">
                  Change Photo
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange}
                    disabled={isLoading}
                  />
                </label>
              </div>
              
              {/* Form Fields */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      name="full_name"
                      className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg bg-neutral-50 cursor-not-allowed"
                      value={user?.email || ''}
                      disabled
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                    <input
                      type="tel"
                      name="phone"
                      className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+62 812 3456 7890"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Company
                  </label>
                  <div className="relative">
                    <Building size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      name="company"
                      className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Your company name"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-3 text-neutral-500" />
                    <textarea
                      name="address"
                      rows={3}
                      className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Your full address"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary flex items-center"
                disabled={isLoading}
              >
                <Save size={18} className="mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserProfile;