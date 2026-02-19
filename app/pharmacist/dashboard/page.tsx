'use client';

import { useState } from 'react';
import {
  LogOut,
  Plus,
  FileUp,
  BarChart3,
  Package,
  Settings,
  Search,
  Trash2,
  Edit,
  MoreVertical,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PharmacistDashboard() {
  const [medicines, setMedicines] = useState([
    {
      id: 1,
      name: 'Aspirin 500mg',
      quantity: 45,
      price: 2.99,
      category: 'Pain Relief',
      lastUpdated: '2024-02-15',
    },
    {
      id: 2,
      name: 'Paracetamol 650mg',
      quantity: 60,
      price: 1.99,
      category: 'Pain Relief',
      lastUpdated: '2024-02-15',
    },
    {
      id: 3,
      name: 'Ibuprofen 400mg',
      quantity: 0,
      price: 3.49,
      category: 'Pain Relief',
      lastUpdated: '2024-02-10',
    },
    {
      id: 4,
      name: 'Amoxicillin 500mg',
      quantity: 25,
      price: 5.99,
      category: 'Antibiotics',
      lastUpdated: '2024-02-12',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    quantity: '',
    price: '',
    category: '',
  });

  const filteredMedicines = medicines.filter((med) =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMedicine.name.trim()) {
      setMedicines([
        ...medicines,
        {
          id: medicines.length + 1,
          name: newMedicine.name,
          quantity: parseInt(newMedicine.quantity) || 0,
          price: parseFloat(newMedicine.price) || 0,
          category: newMedicine.category,
          lastUpdated: new Date().toISOString().split('T')[0],
        },
      ]);
      setNewMedicine({ name: '', quantity: '', price: '', category: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteMedicine = (id: number) => {
    setMedicines(medicines.filter((med) => med.id !== id));
  };

  const totalMedicines = medicines.length;
  const inStockItems = medicines.filter((med) => med.quantity > 0).length;
  const outOfStockItems = medicines.filter((med) => med.quantity === 0).length;

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            Health Plus Pharmacy Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/pharmacist/settings">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="ghost" className="text-destructive hover:bg-destructive/10">
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

        {/* Add Medicine Section */}
        {!showAddForm ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold rounded-2xl h-auto"
            >
              <Plus className="w-6 h-6 mr-2" />
              Add Medicine Manually
            </Button>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5 py-6 text-lg font-semibold rounded-2xl h-auto"
            >
              <FileUp className="w-6 h-6 mr-2" />
              Import from CSV/Google Sheets
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-border mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Add New Medicine</h2>
            <form onSubmit={handleAddMedicine} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Medicine Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Aspirin 500mg"
                    className="py-6 px-4 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary focus:bg-white"
                    value={newMedicine.name}
                    onChange={(e) =>
                      setNewMedicine({ ...newMedicine, name: e.target.value })
                    }
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
                    value={newMedicine.category}
                    onChange={(e) =>
                      setNewMedicine({ ...newMedicine, category: e.target.value })
                    }
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
                    value={newMedicine.quantity}
                    onChange={(e) =>
                      setNewMedicine({ ...newMedicine, quantity: e.target.value })
                    }
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
                    value={newMedicine.price}
                    onChange={(e) =>
                      setNewMedicine({ ...newMedicine, price: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold">
                  Add Medicine
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-border hover:bg-muted px-8 py-3 rounded-xl"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Medicines List */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          {/* Search Bar */}
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

          {/* Table */}
          {filteredMedicines.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Medicine Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Last Updated
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.map((medicine) => (
                    <tr key={medicine.id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-6 py-4 text-foreground font-medium">
                        {medicine.name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {medicine.category}
                      </td>
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
                      <td className="px-6 py-4 text-muted-foreground text-sm">
                        {medicine.lastUpdated}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4 text-primary" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMedicine(medicine.id)}
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
