'use client';

import { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Search,
  ChevronLeft,
  Heart,
  Share2,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PharmacyProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const [searchMedicine, setSearchMedicine] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock pharmacy data
  const pharmacy = {
    id: params.id,
    name: 'Health Plus Pharmacy',
    location: 'Downtown Medical Center',
    distance: 0.5,
    rating: 4.8,
    reviews: 124,
    phone: '+1 (555) 123-4567',
    email: 'info@healthplus.com',
    website: 'www.healthplus.com',
    hours: '8:00 AM - 10:00 PM',
    address: '123 Main Street, City, ZIP 12345',
    image: 'bg-gradient-to-br from-blue-400 to-blue-600',
    description:
      'Health Plus Pharmacy has been serving the community for over 20 years with professional pharmaceutical services and a wide range of medicines.',
    medicines: [
      { id: 1, name: 'Aspirin 500mg', price: 2.99, stock: 45, available: true },
      {
        id: 2,
        name: 'Paracetamol 650mg',
        price: 1.99,
        stock: 60,
        available: true,
      },
      { id: 3, name: 'Ibuprofen 400mg', price: 3.49, stock: 0, available: false },
      {
        id: 4,
        name: 'Amoxicillin 500mg',
        price: 5.99,
        stock: 25,
        available: true,
      },
      {
        id: 5,
        name: 'Metformin 500mg',
        price: 4.49,
        stock: 35,
        available: true,
      },
      {
        id: 6,
        name: 'Atorvastatin 10mg',
        price: 6.99,
        stock: 20,
        available: true,
      },
      {
        id: 7,
        name: 'Lisinopril 5mg',
        price: 4.99,
        stock: 15,
        available: true,
      },
      {
        id: 8,
        name: 'Omeprazole 20mg',
        price: 3.99,
        stock: 40,
        available: true,
      },
      {
        id: 9,
        name: 'Cetirizine 10mg',
        price: 2.49,
        stock: 0,
        available: false,
      },
      {
        id: 10,
        name: 'Vitamin B-Complex',
        price: 5.49,
        stock: 55,
        available: true,
      },
    ],
  };

  const filteredMedicines = pharmacy.medicines.filter((med) =>
    med.name.toLowerCase().includes(searchMedicine.toLowerCase()) && med.available
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/pharmacies" className="flex items-center gap-2 hover:opacity-70">
            <ChevronLeft className="w-5 h-5 text-foreground" />
            <span className="text-foreground font-medium">Back to Pharmacies</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
              <Heart
                className={`w-6 h-6 ${
                  isFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground'
                }`}
              />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="w-6 h-6 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Pharmacy Header */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Header Image */}
            <div className={`${pharmacy.image} rounded-2xl h-64 md:h-auto md:col-span-1`} />

            {/* Pharmacy Info */}
            <div className="md:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">
                    {pharmacy.name}
                  </h1>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 fill-accent text-accent" />
                    <span className="text-xl font-bold text-foreground">
                      {pharmacy.rating}
                    </span>
                    <span className="text-muted-foreground">
                      ({pharmacy.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">{pharmacy.description}</p>

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Location */}
                <div className="bg-primary/5 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Location
                      </p>
                      <p className="text-foreground font-medium">{pharmacy.address}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {pharmacy.distance} km away
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className="bg-primary/5 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Hours
                      </p>
                      <p className="text-foreground font-medium">{pharmacy.hours}</p>
                      <p className="text-sm text-primary mt-1">Currently Open</p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-primary/5 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Phone
                      </p>
                      <a
                        href={`tel:${pharmacy.phone}`}
                        className="text-foreground font-medium hover:text-primary transition-colors"
                      >
                        {pharmacy.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Medicine Count */}
                <div className="bg-accent/10 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        In Stock Medicines
                      </p>
                      <p className="text-foreground font-medium">
                        {pharmacy.medicines.filter(m => m.available).length} available
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Medicines Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Available Medicines
          </h2>

          {/* Search Bar */}
          <div className="mb-8 relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search medicines..."
              className="pl-12 py-6 text-base bg-white border-0 rounded-2xl focus:ring-2 focus:ring-primary transition-all"
              value={searchMedicine}
              onChange={(e) => setSearchMedicine(e.target.value)}
            />
          </div>

          {/* Medicines Grid */}
          {filteredMedicines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map((medicine) => (
                <div
                  key={medicine.id}
                  className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground mb-1">
                        {medicine.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Stock: {medicine.stock} units
                      </p>
                    </div>
                    {medicine.available ? (
                      <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                        Available
                      </span>
                    ) : (
                      <span className="bg-destructive/10 text-destructive text-xs font-semibold px-3 py-1 rounded-full">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <hr className="my-4 border-border" />

                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-primary">
                      ${medicine.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-border">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                No medicines found matching your search.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Need to speak with the pharmacy?
          </h2>
          <p className="text-muted-foreground mb-8">
            Call us directly to confirm availability or ask any questions
          </p>
          <a href={`tel:${pharmacy.phone}`}>
            <Button className="bg-primary hover:bg-primary/90 text-white px-12 py-6 text-lg rounded-xl font-semibold">
              <Phone className="w-5 h-5 mr-2" />
              Call Pharmacy Now
            </Button>
          </a>
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
