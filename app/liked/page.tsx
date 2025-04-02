// li-web/app/liked/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ListingCard from "@/components/ListingCard";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";

interface ListingItem {
  product_id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  location: string;
  status: string;
  created_at: string;
  seller_name: string;
  seller_id: number;
  images: { image_url: string }[];
  is_liked: boolean;
  likes_count: number;
}

const LikedListings = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchLikedListings();
    }
  }, [user]);

  const fetchLikedListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/listings/liked/");
      setListings(response.data);
    } catch (err) {
      console.error("Error fetching liked listings:", err);
      setError("Failed to fetch liked listings");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Please sign in to view your liked listings
          </h2>
          <a
            href="/auth/signin"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Sign in
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Your Liked Listings
          </h1>
          {listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                You haven't liked any listings yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {listings.map((listing) => (
                <ListingCard 
                  key={listing.product_id} 
                  item={listing} 
                  isAuthenticated={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LikedListings;
