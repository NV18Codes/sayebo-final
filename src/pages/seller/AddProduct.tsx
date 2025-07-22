// Full working file with all features requested
import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { SellerLayout } from '../../layouts/SellerLayout';
import { PageHeader } from '../../components/ui/page-header';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../../hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

const AddProduct: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    subcategory: '',
    brand: '',
    condition: 'new',
    imageUrls: [''],
    videoUrls: ['']
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const categories = {
    "Electronics": ["Phones", "Laptops", "Cameras", "Headphones", "Wearables"],
    "Clothing & Accessories": ["Men", "Women", "Kids", "Footwear", "Bags"],
    "Hardware Tools": ["Power Tools", "Hand Tools", "Plumbing", "Electrical", "Safety Gear"],
    "Grocery": ["Fruits & Vegetables", "Beverages", "Snacks", "Dairy", "Staples"],
    "Garden, Pool & Patio": ["Plants", "Outdoor Furniture", "Grills", "Fencing", "Lighting"],
    "Sexual Wellness": ["Condoms", "Lubricants", "Intimate Massagers", "Supplements"],
    "Feminine Hygiene": ["Sanitary Pads", "Tampons", "Menstrual Cups", "Intimate Wash"],
    "Stationery": ["Notebooks", "Pens & Pencils", "Art Supplies", "Organizers"],
    "Toys & Games": ["Action Figures", "Board Games", "Puzzles", "Outdoor Toys"]
  };
  // Add new state to keep track of local files and URLs separately
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);

  // Helper to add a local image file
  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (imageFiles.length + files.length > 5) {
      alert("You can upload up to 5 images only.");
      return;
    }
    setImageFiles(prev => [...prev, ...files]);
  };

  // Helper to add a local video file
  const handleVideoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (videoFiles.length + files.length > 2) {
      alert("You can upload up to 2 videos only.");
      return;
    }
    setVideoFiles(prev => [...prev, ...files]);
  };

  // Remove image file
  const removeImageFile = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Remove video file
  const removeVideoFile = (index: number) => {
    setVideoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const updated = [...formData.imageUrls];
    updated[index] = value;
    setFormData(prev => ({ ...prev, imageUrls: updated }));
  };

  const handleVideoUrlChange = (index: number, value: string) => {
    const updated = [...formData.videoUrls];
    updated[index] = value;
    setFormData(prev => ({ ...prev, videoUrls: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);

      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        subcategory: formData.subcategory,
        brand: formData.brand,
        condition: formData.condition,
        image_urls: formData.imageUrls,
        video_urls: formData.videoUrls,
        seller_id: user.id,
        status: 'active'
      };

      const { error } = await supabase.from('products').insert([productData]);
      if (error) throw error;

      toast({
        title: "Success!",
        description: "Product added successfully",
      });

      navigate('/seller-dashboard/products');
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SellerLayout>
      <PageHeader
        title="Add New Product"
        description="Create a new product listing"
        action={{
          label: "Back to Products",
          onClick: () => navigate('/seller-dashboard/products'),
          icon: <ArrowLeft className="w-4 h-4 mr-2" />
        }}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Product Title *
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter product title"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={(e) => {
                  const selected = e.target.value;
                  setFormData({ ...formData, category: selected, subcategory: "" });
                }}
                required
                className="w-full rounded-md border border-black px-2 py-2 text-sm shadow-sm bg-white text-black focus:outline-none focus:border-black focus:ring-0"
              >
                <option value="">Select a category</option>
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {formData.category && (
                <div className="mt-4">
                  <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategory *
                  </label>
                  <select
                    id="subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={(e) =>
                      setFormData({ ...formData, subcategory: e.target.value })
                    }
                    required
                    className="w-full rounded-md border border-black px-2 py-2 text-sm shadow-sm bg-white text-black focus:outline-none focus:border-black focus:ring-0"
                  >
                    <option value="">Select a subcategory</option>
                    {categories[formData.category].map((subcat) => (
                      <option key={subcat} value={subcat}>{subcat}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (R) *
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                required
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="Product brand"
              />
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full rounded-md border border-black px-2 py-2 text-sm shadow-sm bg-white text-black focus:outline-none focus:border-black focus:ring-0"
              >
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="refurbished">Refurbished</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Describe your product..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images (URLs or Uploads, max 5)
            </label>

            {/* Existing URL inputs */}
            {formData.imageUrls.map((url, idx) => (
              <div key={`url-img-${idx}`} className="flex items-center gap-2 mb-2">
                <Input
                  type="text"
                  value={url}
                  onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.imageUrls.filter((_, i) => i !== idx);
                      setFormData({ ...formData, imageUrls: updated });
                    }}
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}

            {/* File upload input */}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageFileChange}
              className="mb-2"
            />

            {/* Previews for uploaded images */}
            <div className="flex flex-wrap gap-4 mb-4">
              {imageFiles.map((file, idx) => (
                <div key={`file-img-${idx}`} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${idx}`}
                    className="w-24 h-24 object-cover rounded border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageFile(idx)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add another URL input button */}
            {formData.imageUrls.length < 5 && (
              <button
                type="button"
                className="text-blue-600 text-sm underline mt-1"
                onClick={() =>
                  setFormData({ ...formData, imageUrls: [...formData.imageUrls, ''] })
                }
              >
                + Add another image URL
              </button>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Videos (URLs or Uploads, max 2)
            </label>

            {/* Existing URL inputs */}
            {formData.videoUrls.map((url, idx) => (
              <div key={`url-video-${idx}`} className="flex items-center gap-2 mb-2">
                <Input
                  type="text"
                  value={url}
                  onChange={(e) => handleVideoUrlChange(idx, e.target.value)}
                  placeholder="https://example.com/video.mp4"
                />
                {formData.videoUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.videoUrls.filter((_, i) => i !== idx);
                      setFormData({ ...formData, videoUrls: updated });
                    }}
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}

            {/* File upload input */}
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={handleVideoFileChange}
              className="mb-2"
            />

            {/* Previews for uploaded videos */}
            <div className="flex flex-wrap gap-4 mb-4">
              {videoFiles.map((file, idx) => (
                <div key={`file-video-${idx}`} className="relative w-32 h-20 border border-gray-300 rounded overflow-hidden">
                  <video
                    src={URL.createObjectURL(file)}
                    controls
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeVideoFile(idx)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add another URL input button */}
            {formData.videoUrls.length < 2 && (
              <button
                type="button"
                className="text-blue-600 text-sm underline mt-1"
                onClick={() =>
                  setFormData({ ...formData, videoUrls: [...formData.videoUrls, ''] })
                }
              >
                + Add another video URL
              </button>
            )}
          </div>


          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/seller-dashboard/products')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 hover:from-sayebo-pink-600 hover:to-sayebo-orange-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Adding...' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </SellerLayout>
  );
};

export default AddProduct;
