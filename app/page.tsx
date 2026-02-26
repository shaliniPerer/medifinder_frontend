'use client';

import { useState } from 'react';
import { Search, MapPin, Heart, Star, Clock, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
  const [medicines, setMedicines] = useState<string[]>(['']);
  const [location, setLocation] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    const activeMedicines = medicines.filter(m => m.trim());
    if (activeMedicines.length > 0) {
      setHasSearched(true);
      // Mock API call - will be replaced with actual backend
      const mockResults = [
        {
          id: 1,
          name: activeMedicines[0],
          pharmacy: 'Health Plus Pharmacy',
          distance: 0.5,
          rating: 4.8,
          price: 2.99,
          available: true,
        },
        {
          id: 2,
          name: activeMedicines[0],
          pharmacy: 'Care Pharmacy',
          distance: 1.2,
          rating: 4.5,
          price: 2.50,
          available: true,
        },
        {
          id: 3,
          name: activeMedicines[0],
          pharmacy: 'MediCare Store',
          distance: 2.3,
          rating: 4.9,
          price: 3.25,
          available: true,
        },
      ];
      setSearchResults(mockResults);
    }
  };

  const addMedicineField = () => {
    if (medicines.length < 5) {
      setMedicines([...medicines, '']);
    }
  };

  const removeMedicineField = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const updateMedicine = (index: number, value: string) => {
    const updated = [...medicines];
    updated[index] = value;
    setMedicines(updated);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUseCurrentLocation(true);
        // In real app, reverse geocode to get location name
        setLocation('Current Location');
      });
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">MediFind</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pharmacies">
              <Button variant="ghost">Pharmacies</Button>
            </Link>
            <Link href="/portal/login">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Pharmacist Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-foreground mb-4">
              Find Your Medicine, <span className="text-primary">Fast & Easy</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Search for medicines and discover nearby pharmacies with real-time availability
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
            <div className="space-y-4">
              {/* Medicines Search */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-foreground">
                    Search Medicines (Up to 5)
                  </label>
                  <span className="text-xs text-muted-foreground">{medicines.filter(m => m.trim()).length}/5</span>
                </div>
                <div className="space-y-3">
                  {medicines.map((medicine, index) => (
                    <div key={index} className="relative flex gap-2">
                      <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground pointer-events-none" />
                      <Input
                        type="text"
                        placeholder={`Medicine ${index + 1} (e.g., Aspirin, Paracetamol)`}
                        className="pl-12 py-6 text-base bg-muted border-0 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all flex-1"
                        value={medicine}
                        onChange={(e) => updateMedicine(index, e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      {medicines.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => removeMedicineField(index)}
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {medicines.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-3 border-primary text-primary hover:bg-primary/5"
                    onClick={addMedicineField}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Another Medicine
                  </Button>
                )}
              </div>

              {/* Location Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Enter city or area"
                      className="pl-12 py-6 text-base bg-muted border-0 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    className="w-full py-6 text-base border-primary text-primary hover:bg-primary/5"
                    onClick={handleGetLocation}
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    Use Current Location
                  </Button>
                </div>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold rounded-2xl transition-all hover:shadow-lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Medicines & Pharmacies
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Clock, title: '24/7 Service', desc: 'Find open pharmacies anytime' },
              { icon: MapPin, title: 'Nearby', desc: 'Sorted by distance' },
              { icon: Heart, title: 'In Stock', desc: 'See available medicines only' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 text-center border border-border hover:shadow-lg transition-shadow"
              >
                <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Results */}
      {hasSearched && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-foreground mb-2">
                Pharmacies with {medicines.filter(m => m.trim()).join(', ')}
              </h3>
              <p className="text-muted-foreground">
                Found {searchResults.length} pharmacies with your medicines in stock
              </p>
            </div>

            {searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <Link
                    key={result.id}
                    href={`/pharmacies/${1}`}
                    target="_blank"
                  >
                    <div className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg hover:border-primary transition-all cursor-pointer group">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {result.pharmacy}
                          </h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4" />
                            {result.distance} km away
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-5 h-5 fill-accent text-accent" />
                            <span className="font-semibold text-foreground">
                              {result.rating}
                            </span>
                          </div>
                          <span
                            className={`text-sm font-semibold px-3 py-1 rounded-full ${
                              result.available
                                ? 'bg-primary/10 text-primary'
                                : 'bg-destructive/10 text-destructive'
                            }`}
                          >
                            {result.available ? 'Available' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground text-sm mb-1">
                            {result.name}
                          </p>
                          <p className="text-2xl font-bold text-primary">
                            ${result.price}
                          </p>
                        </div>
                        <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl">
                          View Pharmacy
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-border">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No pharmacies found. Try adjusting your search.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      {!hasSearched && (
        <section className="py-20 px-4 bg-secondary/5">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-foreground text-center mb-12">
              Why Choose MediFind?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Real-time Availability',
                  desc: 'Check if medicines are in stock before visiting',
                },
                {
                  title: 'Compare Prices',
                  desc: 'Find the best prices across nearby pharmacies',
                },
                {
                  title: 'Distance Sorting',
                  desc: 'Pharmacies sorted by proximity to your location',
                },
                {
                  title: 'Pharmacy Profiles',
                  desc: 'View complete details, contact, and medicine list',
                },
              ].map((feature, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-border">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-lg text-foreground mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-foreground text-white py-8 px-4 mt-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-4">
            © 2024 MediFind. Helping you find medicines near you.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/about" className="hover:text-primary transition-colors">About
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact
            </Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
