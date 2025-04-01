"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import ListingCard from "@/components/ListingCard";

interface UserProfile {
  id: number;
  email: string;
  username: string;
  nickname: string;
  avatar: string | null;
  is_verified: boolean;
  created_at: string;
}

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

const tabs: string[] = ["Listings", "Reviews", "Liked"];

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Listings");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [likedListings, setLikedListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching current user profile");

        const response = await api.get("/api/profile/");
        console.log("Profile Response:", {
          status: response.status,
          data: response.data,
          headers: response.headers,
        });
        setProfile(response.data);

        // Fetch user's listings
        const listingsResponse = await api.get(
          `/api/listings/?seller=${response.data.id}`
        );
        console.log("Listings Response:", {
          status: listingsResponse.status,
          data: listingsResponse.data,
          headers: listingsResponse.headers,
        });
        setListings(listingsResponse.data);

        // Fetch user's liked listings
        const likedResponse = await api.get("/api/listings/liked/");
        console.log("Liked Listings Response:", {
          status: likedResponse.status,
          data: likedResponse.data,
          headers: likedResponse.headers,
        });
        setLikedListings(likedResponse.data);
      } catch (error: any) {
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: error.config,
        });
        if (error.response?.status === 401) {
          router.push("/auth/signin");
        } else {
          setError("Failed to fetch profile");
        }
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [authLoading, router]);

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8">
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

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Profile not found
              </h1>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row h-screen p-4 md:p-6 gap-4 bg-gray-50">
        {/* Left Panel */}
        <div className="w-full md:w-1/4 bg-white p-4 md:p-6 rounded-2xl shadow-lg">
          <div className="flex flex-col items-center text-center">
            {profile.avatar ? (
              <img
                className="w-20 h-20 md:w-24 md:h-24 mb-4 rounded-full object-cover"
                src={profile.avatar}
                alt={profile.nickname}
              />
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl text-gray-500">
                  {profile.nickname.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <h2 className="text-xl md:text-2xl font-semibold">
              {profile.nickname}
            </h2>
            <p className="text-gray-500">
              Joined: {new Date(profile.created_at).toLocaleDateString()}
            </p>
            {profile.is_verified && (
              <div className="mt-2 flex items-center text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Verified</span>
              </div>
            )}
            <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Edit Profile
            </button>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Account Details</h3>
            <div className="text-left space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {profile.email}
              </p>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Reviews</h3>
                <p className="text-gray-600">⭐⭐⭐⭐⭐ (4.8/5)</p>
                <p className="text-sm text-gray-500">Based on 120 reviews</p>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Member since:</span>{" "}
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-3/4 bg-white p-2 md:p-4 rounded-2xl shadow-lg sm:h-[100%] sm:overflow-scroll">
          <div className="mb-4 flex justify-between md:justify-start space-x-4 border-b pb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`p-2 text-base md:text-lg transition ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 font-semibold text-blue-600"
                    : "text-gray-500 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-2 rounded-lg bg-gray-50">
            {activeTab === "Listings" && (
              <div>
                {listings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No listings found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    {listings.map((item) => (
                      <ListingCard key={item.product_id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === "Reviews" && (
              <p>Show user's received reviews here...</p>
            )}
            {activeTab === "Liked" && (
              <div>
                {likedListings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No liked items found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    {likedListings.map((item) => (
                      <ListingCard key={item.product_id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
