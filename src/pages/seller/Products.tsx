import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SellerLayout } from '../../layouts/SellerLayout';
import { PageHeader } from '../../components/ui/page-header';
import { DataTable } from '../../components/ui/data-table';
import { StatusBadge } from '../../components/ui/status-badge';
import { Button } from '../../components/ui/button';
import { Package, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../../hooks/use-toast';

interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
  category: string;
  status: string;
  created_at: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price, stock, category, status, created_at')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    navigate('/seller-dashboard/add-product');
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('seller_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      fetchProducts(); // Refresh the list
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  const productColumns = [
    {
      key: 'title',
      header: 'Product Name',
      render: (product: Product) => (
        <div className="flex items-center space-x-3">
          <Package className="w-8 h-8 text-gray-400" />
          <div>
            <div className="font-medium">{product.title}</div>
            <div className="text-sm text-gray-500">{product.category}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (product: Product) => (
        <span className="font-semibold">R{product.price.toLocaleString()}</span>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (product: Product) => (
        <span className={product.stock < 10 ? 'text-red-600 font-medium' : 'text-gray-900'}>
          {product.stock} units
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (product: Product) => {
        const variant = product.status === 'active' ? 'success' :
          product.status === 'draft' ? 'warning' : 'default';
        return <StatusBadge status={product.status} variant={variant} />;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (product: Product) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            title="View Product"
            onClick={() => navigate(`/seller-dashboard/products/${product.id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Edit Product"
            onClick={() => navigate(`/seller-dashboard/products/edit/${product.id}`)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Delete Product"
            onClick={() => handleDeleteProduct(product.id)}
          >
            <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <SellerLayout>
      <PageHeader
        title="Products"
        description="Manage your product inventory"
        action={{
          label: "Add Product",
          onClick: handleAddProduct,
          icon: <Plus className="w-4 h-4 mr-2" />
        }}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <DataTable
          data={products}
          columns={productColumns}
          loading={loading}
          emptyMessage="No products found. Add your first product to get started."
        />
      </div>
    </SellerLayout>
  );
};

export default Products;
