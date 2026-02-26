'use client';

import { useState } from 'react';
import { MapPin, Phone, Clock, Star, Search, SortAsc } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PharmaciesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('distance');

  // Mock pharmacy data
  const mockPharmacies = [
    {
      id: 1,
      name: 'Health Plus Pharmacy',
      location: 'Downtown Medical Center',
      distance: 0.5,
      rating: 4.8,
      reviews: 124,
      phone: '+1 (555) 123-4567',
      hours: '8:00 AM - 10:00 PM',
      medicines: 2500,
      open: true,
      address: '123 Main Street, City',
      image: 'bg-gradient-to-br from-blue-400 to-blue-600',
    },
    {
      id: 2,
      name: 'Care Pharmacy',
      location: 'Central District',
      distance: 1.2,
      rating: 4.5,
      reviews: 89,
      phone: '+1 (555) 234-5678',
      hours: '7:00 AM - 9:00 PM',
      medicines: 1800,
      open: true,
      address: '456 Oak Avenue, City',
      image: 'bg-gradient-to-br from-green-400 to-green-600',
    },
    {
      id: 3,
      name: 'MediCare Store',
      location: 'North Zone',
      distance: 2.3,
      rating: 4.9,
      reviews: 156,
      phone: '+1 (555) 345-6789',
      hours: '9:00 AM - 8:00 PM',
      medicines: 3200,
      open: true,
      address: '789 Pine Road, City',
      image: 'bg-gradient-to-br from-purple-400 to-purple-600',
    },
    {
      id: 4,
      name: 'Quick Med Pharmacy',
      location: 'East Market',
      distance: 1.8,
      rating: 4.3,
      reviews: 67,
      phone: '+1 (555) 456-7890',
      hours: '6:00 AM - 11:00 PM',
      medicines: 2100,
      open: true,
      address: '321 Elm Street, City',
      image: 'bg-gradient-to-br from-orange-400 to-orange-600',
    },
    {
      id: 5,
      name: 'Family Wellness Pharmacy',
      location: 'West Side',
      distance: 3.1,
      rating: 4.6,
      reviews: 98,
      phone: '+1 (555) 567-8901',
      hours: '8:00 AM - 9:00 PM',
      medicines: 1900,
      open: false,
      address: '654 Maple Lane, City',
      image: 'bg-gradient-to-br from-red-400 to-red-600',
    },
    {
      id: 6,
      name: 'Express Pharma',
      location: 'South City',
      distance: 2.9,
      rating: 4.7,
      reviews: 112,
      phone: '+1 (555) 678-9012',
      hours: '7:00 AM - 10:00 PM',
      medicines: 2400,
      open: true,
      address: '987 Cedar Lane, City',
      image: 'bg-gradient-to-br from-cyan-400 to-cyan-600',
    },
  ];

  const sortedPharmacies = [...mockPharmacies]
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">MediFind</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/portal/login">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Pharmacist Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Browse All <span className="text-primary">Pharmacies</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            Explore pharmacies in your area, sorted alphabetically or by distance
          </p>

          {/* Search and Sort Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search pharmacy name..."
                className="pl-12 py-6 text-base bg-white border-0 rounded-2xl focus:ring-2 focus:ring-primary transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <SortAsc className="w-5 h-5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl bg-white border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              >
                <option value="distance">Sort by Distance</option>
                <option value="rating">Sort by Rating</option>
                <option value="name">Sort A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Pharmacies Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="text-muted-foreground">
              Showing {sortedPharmacies.length} pharmacies
            </p>
          </div>

          {sortedPharmacies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPharmacies.map((pharmacy) => (
                <Link
                  key={pharmacy.id}
                  href={`/pharmacies/${pharmacy.id}`}
                >
                  <div className="bg-white rounded-3xl overflow-hidden border border-border hover:shadow-xl transition-all hover:border-primary cursor-pointer h-full group">
                    {/* Pharmacy Image */}
                    <div className={`${pharmacy.image} h-48 relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                      {pharmacy.open && (
                        <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                          Open
                        </div>
                      )}
                      {!pharmacy.open && (
                        <div className="absolute top-4 right-4 bg-destructive text-white px-4 py-2 rounded-full text-sm font-semibold">
                          Closed
                        </div>
                      )}
                    </div>

                    {/* Pharmacy Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {pharmacy.name}
                      </h3>

                      {/* Location */}
                      <div className="flex items-start gap-2 mb-4">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {pharmacy.location}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {pharmacy.distance} km away
                          </p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="text-sm font-semibold text-foreground ml-1">
                            {pharmacy.rating}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({pharmacy.reviews} reviews)
                        </span>
                      </div>

                      <hr className="my-4 border-border" />

                      {/* Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-foreground">{pharmacy.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-foreground">{pharmacy.hours}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold text-foreground">
                            {pharmacy.medicines}
                          </span>
                          <span className="text-muted-foreground"> medicines in stock</span>
                        </div>
                      </div>

                      <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold py-5">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-16 text-center border border-border">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No pharmacies found
              </h3>
              <p className="text-muted-foreground">
                Try searching with different terms
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-8 px-4 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-4">
            © 2024 MediFind. Helping you find medicines near you.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/about" className="hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
