
import React, { useState, useEffect } from 'react';
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
  name: string;
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

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
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

  const productColumns = [
    {
      key: 'name',
      header: 'Product Name',
      render: (product: Product) => (
        <div className="flex items-center space-x-3">
          <Package className="w-8 h-8 text-gray-400" />
          <div>
            <div className="font-medium">{product.name}</div>
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
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="w-4 h-4" />
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
        action={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        }
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
