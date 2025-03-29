"use client";
import ListingCard from "@/components/ListingCard";
import Navbar from "@/components/Navbar";
//import dummy from "@/constants/dummy";
import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Page = () => {
  const [data, setData] = useState<ListingItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!authLoading && !user) {
      router.push("/auth/signin");
      return;
    }

    // Only fetch data if user is authenticated
    if (user) {
      fetchData();
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await api.get("/api/listings/");
      console.log("Data: ", result.data);
      setData(result.data);
    } catch (error: any) {
      console.error("Error fetching listings:", error);
      if (error.response?.status === 401) {
        // If unauthorized, redirect to login
        router.push("/auth/signin");
      } else {
        setError(error.response?.data?.detail || "Failed to fetch listings");
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
    <>
      {" "}
      {/*<Navbar />{" "}*/}
      <main className="container mx-auto px-2 py-4 sm:px-6 sm:py-8 w-full bg-white z-0 mt-20">
        {" "}
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          {" "}
          Latest Listings{" "}
        </h1>{" "}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 z-0">
          {" "}
          {data?.map((item) => (
            <ListingCard key={item.product_id} item={item} />
          ))}{" "}
        </div>{" "}
      </main>{" "}
    </>
  );
};

export default Page;
