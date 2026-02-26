'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  LogOut,
  Plus,
  FileUp,
  BarChart3,
  Package,
  Search,
  Trash2,
  Edit,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Medicine {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  lastUpdated: string;
}

interface MedicineFormData {
  name: string;
  quantity: string;
  price: string;
  category: string;
}

const emptyForm: MedicineFormData = { name: '', quantity: '', price: '', category: '' };

export default function PharmacistPortalDashboard() {
  const router = useRouter();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MedicineFormData>(emptyForm);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [sheetUrl, setSheetUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importMsg, setImportMsg] = useState('');

  const fetchMedicines = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/medicines');
      if (!res.ok) throw new Error('Failed to load medicines');
      const data = await res.json();
      setMedicines(data.medicines);
    } catch {
      setError('Could not load medicines. Please refresh.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

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

  const openEditForm = (m: Medicine) => {
    setEditingId(m.id);
    setFormData({
      name: m.name,
      quantity: String(m.quantity),
      price: String(m.price),
      category: m.category,
    });
    setFormError('');
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSaving(true);

    try {
      const url = editingId ? `/api/medicines/${editingId}` : '/api/medicines';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          quantity: parseInt(formData.quantity) || 0,
          price: parseFloat(formData.price) || 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setFormError(data.error ?? 'Failed to save. Please try again.');
        return;
      }

      await fetchMedicines();
      setShowForm(false);
    } catch {
      setFormError('An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;
    try {
      const res = await fetch(`/api/medicines/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setMedicines((prev) => prev.filter((m) => m.id !== id));
    } catch {
      setError('Failed to delete medicine.');
    }
  };

  const handleGoogleSheetsImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsImporting(true);
    setImportMsg('');
    try {
      const res = await fetch('/api/medicines/import/google-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setImportMsg(`Error: ${data.error}`);
      } else {
        setImportMsg(
          `Imported ${data.imported} medicine(s).${data.errors?.length ? ` ${data.errors.length} row(s) skipped.` : ''}`
        );
        await fetchMedicines();
        setSheetUrl('');
      }
    } catch {
      setImportMsg('Import failed. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const filteredMedicines = medicines.filter((med) =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMedicines = medicines.length;
  const inStockItems = medicines.filter((med) => med.quantity > 0).length;
  const outOfStockItems = medicines.filter((med) => med.quantity === 0).length;

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            Pharmacy Dashboard
          </h1>
          <div className="flex items-center gap-4">
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Medicines</p>
                <p className="text-3xl font-bold text-foreground">{totalMedicines}</p>
              </div>
              <Package className="w-10 h-10 text-primary/20" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">In Stock</p>
                <p className="text-3xl font-bold text-primary">{inStockItems}</p>
              </div>
              <BarChart3 className="w-10 h-10 text-primary/20" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Out of Stock</p>
                <p className="text-3xl font-bold text-destructive">{outOfStockItems}</p>
              </div>
              <BarChart3 className="w-10 h-10 text-destructive/20" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button
            onClick={openAddForm}
            className="bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold rounded-2xl h-auto"
          >
            <Plus className="w-6 h-6 mr-2" />
            Add Medicine Manually
          </Button>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/5 py-6 text-lg font-semibold rounded-2xl h-auto"
            onClick={() => { setShowImport(true); setImportMsg(''); }}
          >
            <FileUp className="w-6 h-6 mr-2" />
            Import from Google Sheets
          </Button>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-8 border border-border mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {editingId ? 'Edit Medicine' : 'Add New Medicine'}
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
                    Medicine Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Aspirin 500mg"
                    className="py-6 px-4 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary focus:bg-white"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Category
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Pain Relief"
                    className="py-6 px-4 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary focus:bg-white"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    className="py-6 px-4 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary focus:bg-white"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Price ($)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="py-6 px-4 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary focus:bg-white"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold"
                >
                  {isSaving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Medicine'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-border hover:bg-muted px-8 py-3 rounded-xl"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Google Sheets Import Form */}
        {showImport && (
          <div className="bg-white rounded-2xl p-8 border border-border mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Import from Google Sheets</h2>
              <button
                onClick={() => setShowImport(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close import"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your sheet must have columns: <strong>name</strong>, <strong>quantity</strong>,{' '}
              <strong>price</strong> (and optionally <strong>category</strong>) in the first row.
              Make sure the sheet is publicly readable.
            </p>
            {importMsg && (
              <div className="mb-4 p-3 bg-muted rounded-xl text-sm text-foreground">
                {importMsg}
              </div>
            )}
            <form onSubmit={handleGoogleSheetsImport} className="flex gap-4">
              <Input
                type="url"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="flex-1 py-5 px-4 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary focus:bg-white"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                required
              />
              <Button
                type="submit"
                disabled={isImporting}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-semibold"
              >
                {isImporting ? 'Importing…' : 'Import'}
              </Button>
            </form>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Medicines List */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search medicines..."
                className="pl-12 py-6 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">Loading medicines…</p>
            </div>
          ) : filteredMedicines.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Medicine Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Quantity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Last Updated</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.map((medicine) => (
                    <tr key={medicine.id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-6 py-4 text-foreground font-medium">{medicine.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{medicine.category}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            medicine.quantity === 0
                              ? 'bg-destructive/10 text-destructive'
                              : medicine.quantity < 20
                              ? 'bg-accent/10 text-accent'
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          {medicine.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-foreground font-semibold">
                        ${medicine.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">{medicine.lastUpdated}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditForm(medicine)}>
                            <Edit className="w-4 h-4 text-primary" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(medicine.id)}
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
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No medicines found.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
