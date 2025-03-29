/*"use client";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ListItem from "@/components/ListItem";

const ListingDetails = () => {
  const [data, setData] = useState<ListingItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { slug, product_id } = useParams();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/listings/${slug}/${product_id}/`);
      const result = await response.json();
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
  if (!data) return <div className="text-center p-4">No data found</div>;
  return (
    <>
      {" "}
      <Navbar /> 
      <main className="container mx-auto p-6 bg-white shadow-md rounded-lg">
        <ListItem item={data} />
      </main>
    </>
  );
};

export default ListingDetails;*/
"use client";
import ListItem from "@/components/ListItem";
import Navbar from "@/components/Navbar";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const params = useParams<{ slug: string; product_id: string }>();
  const [data, setData] = useState<ListingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://127.0.0.1:8000/api/listings/${params.slug}/${params.product_id}/`
      );
      const result = await response.json();
      console.log(result);
      setData(result);
    } catch (error) {
      // @ts-ignore
      setError(error instanceof Error ? error : new Error("An error occured"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!data) return <div className="text-center p-4">No data found</div>;
  return (
    <>
      {" "}
      {/*<Navbar />*/}
      <main className="container mx-auto p-6 bg-white shadow-md rounded-lg mt-20">
        <ListItem item={data} />
      </main>
    </>
  );
};

export default page;
