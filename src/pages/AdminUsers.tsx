import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import { supabase } from '../integrations/supabase/client';
import { Trash2 } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [removing, setRemoving] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, created_at, role')
        .eq('role', 'buyer');
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id, email) => {
    setRemoving(id);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setToast({ type: 'success', message: `User ${email} removed successfully.` });
      fetchUsers();
    } catch (error) {
      setToast({ type: 'error', message: `Failed to remove user ${email}.` });
      console.error('Remove user error:', error);
    } finally {
      setRemoving(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  // Filter users by search
  const filteredUsers = users.filter(user => {
    const q = search.toLowerCase();
    return (
      (user.first_name + ' ' + user.last_name).toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    );
  });

  // Confirmation dialog state
  const [confirm, setConfirm] = useState({ open: false, id: null, email: '' });

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto py-8">
        <h2 className="text-3xl font-bold gradient-text mb-6">Users Management</h2>
        {/* Search bar */}
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="input-field max-w-xs"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold gradient-text">All Users</h3>
          </div>
          <div className="card-body overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4">Name</th>
                  <th className="text-left py-2 px-4">Email</th>
                  <th className="text-left py-2 px-4">Joined</th>
                  <th className="py-2 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="py-4 text-center text-gray-400">Loading...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan={4} className="py-4 text-center text-gray-400">No users found.</td></tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-sayebo-pink-50 transition-colors">
                      <td className="py-2 px-4 font-medium align-middle">{user.first_name} {user.last_name}</td>
                      <td className="py-2 px-4 align-middle">{user.email}</td>
                      <td className="py-2 px-4 align-middle">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="py-2 px-4 align-middle text-center">
                        <button
                          className="btn-outline text-red-600 flex items-center justify-center gap-2 mx-auto"
                          style={{ minWidth: 100 }}
                          disabled={removing === user.id}
                          onClick={() => setConfirm({ open: true, id: user.id, email: user.email })}
                        >
                          <Trash2 className="w-4 h-4" />
                          {removing === user.id ? 'Removing...' : 'Remove'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Confirmation Dialog */}
        {confirm.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
              <h3 className="text-xl font-bold mb-2 text-red-600">Remove User?</h3>
              <p className="mb-6">Are you sure you want to remove <span className="font-semibold">{confirm.email}</span>? This cannot be undone.</p>
              <div className="flex justify-center gap-4">
                <button className="btn-secondary" onClick={() => setConfirm({ open: false, id: null, email: '' })}>Cancel</button>
                <button
                  className="btn-primary bg-gradient-to-r from-red-500 to-orange-500"
                  onClick={() => {
                    setConfirm({ open: false, id: null, email: '' });
                    handleRemove(confirm.id, confirm.email);
                  }}
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg text-white font-semibold ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {toast.message}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers; 