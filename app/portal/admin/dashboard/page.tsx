'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  LogOut,
  Plus,
  Trash2,
  Edit,
  Search,
  Users,
  CheckCircle,
  XCircle,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Pharmacist {
  id: string;
  name: string;
  email: string;
  pharmacy: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface PharmacistFormData {
  name: string;
  email: string;
  pharmacy: string;
  status: 'active' | 'inactive';
  password: string;
}

const emptyForm: PharmacistFormData = {
  name: '',
  email: '',
  pharmacy: '',
  status: 'active',
  password: '',
};

export default function AdminDashboard() {
  const router = useRouter();
  const [pharmacists, setPharmacists] = useState<Pharmacist[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PharmacistFormData>(emptyForm);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchPharmacists = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/pharmacists');
      if (!res.ok) throw new Error('Failed to load pharmacists');
      const data = await res.json();
      setPharmacists(data.pharmacists);
    } catch {
      setError('Could not load pharmacists. Please refresh.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPharmacists();
  }, [fetchPharmacists]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/portal/login');
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (p: Pharmacist) => {
    setEditingId(p.id);
    setFormData({ name: p.name, email: p.email, pharmacy: p.pharmacy, status: p.status });
    setFormError('');
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSaving(true);

    try {
      const url = editingId
        ? `/api/admin/pharmacists/${editingId}`
        : '/api/admin/pharmacists';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setFormError(data.error ?? 'Failed to save. Please try again.');
        return;
      }

      await fetchPharmacists();
      setShowForm(false);
    } catch {
      setFormError('An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pharmacist?')) return;

    try {
      const res = await fetch(`/api/admin/pharmacists/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setPharmacists((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError('Failed to delete pharmacist.');
    }
  };

  const filtered = pharmacists.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pharmacy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = pharmacists.filter((p) => p.status === 'active').length;
  const inactiveCount = pharmacists.filter((p) => p.status === 'inactive').length;

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground leading-none">
                Admin Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">Super Admin Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                Public Site
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Pharmacists</p>
                <p className="text-3xl font-bold text-foreground">{pharmacists.length}</p>
              </div>
              <Users className="w-10 h-10 text-primary/20" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Active</p>
                <p className="text-3xl font-bold text-primary">{activeCount}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-primary/20" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Inactive</p>
                <p className="text-3xl font-bold text-destructive">{inactiveCount}</p>
              </div>
              <XCircle className="w-10 h-10 text-destructive/20" />
            </div>
          </div>
        </div>

        {/* Add / Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, email, or pharmacy…"
              className="pl-12 py-6 rounded-xl bg-white border border-border focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={openAddForm}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-6 rounded-xl font-semibold h-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Pharmacist
          </Button>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-border p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {editingId ? 'Edit Pharmacist' : 'Add New Pharmacist'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
                <p className="text-sm text-destructive">{formError}</p>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Jane Smith"
                    className="py-5 px-4 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary focus:bg-white"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="jane@pharmacy.com"
                    className="py-5 px-4 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary focus:bg-white"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Pharmacy Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Health Plus Pharmacy"
                    className="py-5 px-4 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary focus:bg-white"
                    value={formData.pharmacy}
                    onChange={(e) =>
                      setFormData({ ...formData, pharmacy: e.target.value })
                    }
                    required
                  />
                </div>
                {!editingId && (
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Minimum 8 characters"
                      className="py-5 px-4 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary focus:bg-white"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingId}
                      minLength={8}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Status
                  </label>
                  <select
                    className="w-full py-5 px-4 rounded-xl bg-muted border-0 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'active' | 'inactive',
                      })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold"
                >
                  {isSaving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Pharmacist'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-border px-8 py-3 rounded-xl"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Pharmacists Table */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">Loading pharmacists…</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Pharmacy
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((pharmacist) => (
                    <tr
                      key={pharmacist.id}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">
                        {pharmacist.name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {pharmacist.email}
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {pharmacist.pharmacy}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            pharmacist.status === 'active'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {pharmacist.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">
                        {pharmacist.createdAt}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditForm(pharmacist)}
                            aria-label="Edit pharmacist"
                          >
                            <Edit className="w-4 h-4 text-primary" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(pharmacist.id)}
                            aria-label="Delete pharmacist"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground">
                {searchTerm ? 'No pharmacists match your search.' : 'No pharmacists found.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
