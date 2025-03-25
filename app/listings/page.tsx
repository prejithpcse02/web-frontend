"use client";
import ListingCard from "@/components/ListingCard";
import Navbar from "@/components/Navbar";
//import dummy from "@/constants/dummy";
import React, { useEffect, useState } from "react";
import axios from "axios";
const page = () => {
  const [data, setData] = useState<ListingItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await axios("http://127.0.0.1:8000/api/listings/");
      console.log("Data: ", result.data);
      setData(result.data);
    } catch (error) {
      // @ts-ignore
      setError(error instanceof Error ? error : new Error("An error occured"));
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <>
      {" "}
      <Navbar />{" "}
      <main className="container mx-auto px-2 py-4 sm:px-4 sm:py-8 w-full bg-white">
        {" "}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {" "}
          Latest Listings{" "}
        </h1>{" "}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
          {" "}
          {data?.map((item) => (
            <ListingCard key={item.id} item={item} />
          ))}{" "}
        </div>{" "}
      </main>{" "}
    </>
  );
};

export default page;
