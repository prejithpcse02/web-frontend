"use client";
import ListingCard from "@/components/ListingCard";
import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

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

const Page = () => {
  const [data, setData] = useState<ListingItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await api.get("/api/listings");
      console.log("Data: ", result.data);
      setData(result.data);
    } catch (error: any) {
      console.error("Error fetching listings:", error);
      setError(error.response?.data?.detail || "Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-2 py-4 sm:px-6 sm:py-8 w-full bg-white z-0">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Latest Listings
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 z-0">
        {data?.map((item) => (
          <ListingCard
            key={item.product_id}
            item={item}
            isAuthenticated={!!user}
          />
        ))}
      </div>
    </main>
  );
};

export default Page;
