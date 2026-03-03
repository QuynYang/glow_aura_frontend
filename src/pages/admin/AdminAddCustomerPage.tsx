import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Phone, MapPin, 
  Calendar, Shield, CheckCircle2, Upload, 
  Image as ImageIcon 
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';

export const AdminAddCustomerPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'female',
    address: '',
    membershipTier: 'none',
    status: 'active'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API Call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/admin/customers');
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto font-sans text-gray-900">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/admin/customers')}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Customer</h1>
                    <p className="text-sm text-gray-500 mt-1">Create a new customer profile and account details</p>
                </div>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* === LEFT COLUMN (General Info) === */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Basic Information */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                        <User className="w-5 h-5 text-[#3D021E]" /> General Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name <span className="text-red-500">*</span></label>
                            <input required type="text" name="firstName" placeholder="e.g. Jane" 
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none transition-colors"
                                value={formData.firstName} onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name <span className="text-red-500">*</span></label>
                            <input required type="text" name="lastName" placeholder="e.g. Doe" 
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none transition-colors"
                                value={formData.lastName} onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input required type="email" name="email" placeholder="jane.doe@example.com" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none transition-colors"
                                    value={formData.email} onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input required type="tel" name="phone" placeholder="(+84) 90 123 4567" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none transition-colors"
                                    value={formData.phone} onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Personal Details & Address */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                        <MapPin className="w-5 h-5 text-[#3D021E]" /> Personal Details & Address
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="date" name="dateOfBirth" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none transition-colors text-gray-600"
                                    value={formData.dateOfBirth} onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                            <select name="gender" 
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none transition-colors appearance-none"
                                value={formData.gender} onChange={handleChange}
                            >
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                                <option value="other">Other / Prefer not to say</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Address</label>
                        <textarea rows={3} name="address" placeholder="Enter complete address..." 
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none resize-none transition-colors"
                            value={formData.address} onChange={handleChange}
                        />
                    </div>
                </div>

            </div>

            {/* === RIGHT COLUMN (Profile Picture & Account) === */}
            <div className="lg:col-span-1 space-y-6">
                
                {/* 1. Profile Picture */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                    <h2 className="text-lg font-bold mb-6 text-left flex items-center gap-2 border-b border-gray-100 pb-4">
                        <ImageIcon className="w-5 h-5 text-[#3D021E]" /> Profile Picture
                    </h2>
                    
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full border-4 border-gray-50 overflow-hidden bg-gray-100 mb-4 relative group">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                    <User className="w-10 h-10 mb-1 opacity-50" />
                                </div>
                            )}
                            {/* Hover overlay */}
                            <label className="absolute inset-0 bg-black/50 hidden group-hover:flex flex-col items-center justify-center cursor-pointer transition-all">
                                <Upload className="w-6 h-6 text-white mb-1" />
                                <span className="text-[10px] text-white font-bold uppercase tracking-wider">Upload</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                        <p className="text-xs text-gray-500 max-w-[200px] leading-relaxed">
                            Allowed format: JPG, PNG. Max size: 2MB.
                        </p>
                    </div>
                </div>

                {/* 2. Account Settings */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                        <Shield className="w-5 h-5 text-[#3D021E]" /> Account Settings
                    </h2>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Membership Tier</label>
                            <select name="membershipTier" 
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none transition-colors"
                                value={formData.membershipTier} onChange={handleChange}
                            >
                                <option value="none">New Member</option>
                                <option value="bronze">Bronze</option>
                                <option value="silver">Silver</option>
                                <option value="gold">Gold</option>
                                <option value="platinum">Platinum</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="status" value="active" 
                                        checked={formData.status === 'active'} onChange={handleChange}
                                        className="w-4 h-4 text-green-600 focus:ring-green-600"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Active</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="status" value="inactive" 
                                        checked={formData.status === 'inactive'} onChange={handleChange}
                                        className="w-4 h-4 text-red-600 focus:ring-red-600"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Inactive</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 mt-2 space-y-3">
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-[#3D021E] text-white font-bold rounded-xl hover:bg-[#5a032d] shadow-lg shadow-pink-200 transition-all disabled:opacity-70"
                        >
                            {isSubmitting ? 'Saving...' : <><CheckCircle2 className="w-5 h-5" /> Save Customer</>}
                        </button>
                        <button 
                            type="button"
                            onClick={() => navigate('/admin/customers')}
                            className="w-full py-3 bg-white text-gray-700 font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

            </div>
        </form>
      </div>
    </AdminLayout>
  );
};