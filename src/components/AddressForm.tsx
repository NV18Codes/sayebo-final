
import { useState } from 'react';
import { provinces } from '../utils/southAfricanUtils';
import { MapPin, Home, Building, Phone } from 'lucide-react';

interface AddressFormProps {
  initialAddress?: Address;
  onSave: (address: Address) => void;
  onCancel: () => void;
}

interface Address {
  id?: string;
  user_id?: string;
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  suburb: string;
  city: string;
  province: string;
  postal_code: string;
  is_default: boolean;
}

export const AddressForm = ({ initialAddress, onSave, onCancel }: AddressFormProps) => {
  const [formData, setFormData] = useState<Address>(
    initialAddress || {
      type: 'home',
      name: '',
      phone: '',
      address_line_1: '',
      address_line_2: '',
      suburb: '',
      city: '',
      province: 'Gauteng',
      postal_code: '',
      is_default: false
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address_line_1.trim()) newErrors.address_line_1 = 'Address is required';
    if (!formData.suburb.trim()) newErrors.suburb = 'Suburb is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postal_code.trim()) newErrors.postal_code = 'Postal code is required';
    else if (!/^[0-9]{4}$/.test(formData.postal_code)) {
      newErrors.postal_code = 'Postal code must be 4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: keyof Address, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        {initialAddress ? 'Edit Address' : 'Add New Address'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Address Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Type
          </label>
          <div className="flex space-x-4">
            {[
              { value: 'home', label: 'Home', icon: Home },
              { value: 'work', label: 'Work', icon: Building },
              { value: 'other', label: 'Other', icon: MapPin }
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleInputChange('type', value)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  formData.type === value
                    ? 'border-pink-400 bg-pink-50 text-pink-600'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Name and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                errors.name ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Enter full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                  errors.phone ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="0XX XXX XXXX"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* Address Lines */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Line 1 *
          </label>
          <input
            type="text"
            value={formData.address_line_1}
            onChange={(e) => handleInputChange('address_line_1', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 ${
              errors.address_line_1 ? 'border-red-300' : 'border-gray-200'
            }`}
            placeholder="Street address, P.O. Box, company name"
          />
          {errors.address_line_1 && <p className="text-red-500 text-sm mt-1">{errors.address_line_1}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Line 2 (Optional)
          </label>
          <input
            type="text"
            value={formData.address_line_2 || ''}
            onChange={(e) => handleInputChange('address_line_2', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="Apartment, suite, unit, building, floor, etc."
          />
        </div>

        {/* Suburb, City, Province */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Suburb *
            </label>
            <input
              type="text"
              value={formData.suburb}
              onChange={(e) => handleInputChange('suburb', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                errors.suburb ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Suburb"
            />
            {errors.suburb && <p className="text-red-500 text-sm mt-1">{errors.suburb}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                errors.city ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="City"
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Province *
            </label>
            <select
              value={formData.province}
              onChange={(e) => handleInputChange('province', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              {provinces.map(province => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Postal Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code *
            </label>
            <input
              type="text"
              value={formData.postal_code}
              onChange={(e) => handleInputChange('postal_code', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                errors.postal_code ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="0000"
              maxLength={4}
            />
            {errors.postal_code && <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>}
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) => handleInputChange('is_default', e.target.checked)}
                className="rounded border-gray-300 text-pink-400 focus:ring-pink-300"
              />
              <span className="ml-2 text-sm text-gray-600">Set as default address</span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex space-x-4 pt-6">
          <button
            type="submit"
            className="flex-1 btn-primary"
          >
            Save Address
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
