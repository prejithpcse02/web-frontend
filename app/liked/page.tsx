// li-web/app/liked/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ListingCard from "@/components/ListingCard";
import Navbar from "@/components/Navbar";

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
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLikedListings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(
          "http://127.0.0.1:8000/api/listings/liked/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        // Transform the data to include is_liked and likes_count
        const transformedListings = response.data.map((listing: any) => ({
          ...listing,
          is_liked: true, // Since these are liked listings
          likes_count: listing.likes_count || 0,
        }));

        setListings(transformedListings);
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        } else if (error.response?.status === 403) {
          setError("You don't have permission to view liked listings");
        } else {
          setError("Failed to fetch liked listings. Please try again later.");
          console.error("Error fetching liked listings:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLikedListings();
  }, [router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-100 py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-100 py-8">
          <div className="container mx-auto px-4">
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          </div>
        </div>
      </>
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
                <ListingCard key={listing.product_id} item={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LikedListings;
