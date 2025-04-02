"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ListingCard from "@/components/ListingCard";
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

interface ProfileData {
  username: string;
  nickname: string;
  email: string;
  profile_picture?: string;
  listings: ListingItem[];
}

const ProfilePage = () => {
  const params = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [params.nickname]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/profiles/${params.nickname}/`);
      setProfile(response.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to fetch profile");
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        {profile.profile_picture && (
          <img
            src={profile.profile_picture}
            alt={profile.username}
            className="w-32 h-32 rounded-full mb-4"
          />
        )}
        <h1 className="text-2xl font-bold text-gray-800">{profile.username}</h1>
        <p className="text-gray-600">@{profile.nickname}</p>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Listings</h2>
      {profile.listings.length === 0 ? (
        <div className="text-center text-gray-600">
          No listings found for this user.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {profile.listings.map((item) => (
            <ListingCard
              key={item.product_id}
              item={item}
              isAuthenticated={!!user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
