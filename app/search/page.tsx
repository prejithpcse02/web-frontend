// li-web/app/search/page.tsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import ListingCard from "@/components/ListingCard";
import debounce from "lodash/debounce";

interface SearchRecord {
  query: string;
  user: number;
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

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ListingItem[]>([]);
  const [recentListings, setRecentListings] = useState<ListingItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!authLoading && !user) {
      router.push("/auth/signin");
      return;
    }

    // Only fetch data if user is authenticated
    if (user) {
      fetchRecentListings();
      // Load recent searches from localStorage
      const savedSearches = localStorage.getItem("recentSearches");
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches));
      }
    }
  }, [user, authLoading, router]);

  const fetchRecentListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/listings/recent/");
      setRecentListings(response.data);
    } catch (error: any) {
      console.error("Error fetching recent listings:", error);
      if (error.response?.status === 401) {
        router.push("/auth/signin");
      } else {
        setError("Failed to fetch recent listings");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateRecentSearches = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Get current searches from localStorage
    const savedSearches = localStorage.getItem("recentSearches");
    let searches: string[] = savedSearches ? JSON.parse(savedSearches) : [];

    // Remove the new search if it already exists
    searches = searches.filter((s) => s !== searchQuery);

    // Add the new search at the beginning
    searches.unshift(searchQuery);

    // Keep only the last 3 searches
    searches = searches.slice(0, 3);

    // Save back to localStorage
    localStorage.setItem("recentSearches", JSON.stringify(searches));
    setRecentSearches(searches);
  };

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setQuery(searchQuery);
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(
        `/api/listings/search/?query=${encodeURIComponent(searchQuery)}`
      );
      setResults(response.data);
    } catch (error: any) {
      console.error("Search error:", error);
      if (error.response?.status === 401) {
        router.push("/auth/signin");
      } else {
        setError("Failed to perform search");
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Create a debounced version of handleSearch
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      handleSearch(searchQuery);
    }, 500),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    // Trigger debounced search on every keystroke
    debouncedSearch(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Cancel any pending debounced search
      debouncedSearch.cancel();
      // Update recent searches only when Enter is pressed
      updateRecentSearches(query);
      handleSearch(query);
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

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Search Input */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Search listings..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => {
              // Cancel any pending debounced search
              debouncedSearch.cancel();
              // Update recent searches when search button is clicked
              updateRecentSearches(query);
              handleSearch(query);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && !query && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Recent Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(search);
                    handleSearch(search);
                    updateRecentSearches(search);
                  }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {/* Content */}
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {query ? (
            // Search Results
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Search Results for "{query}"
              </h2>
              {results.length === 0 ? (
                <div className="text-center py-8">
                  No results found for "{query}"
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {results.map((item) => (
                    <ListingCard
                      key={item.product_id}
                      item={item}
                      isAuthenticated={!!user}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Recent Listings
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Recently Added Listings
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 z-0">
                {recentListings.map((item) => (
                  <ListingCard
                    key={item.product_id}
                    item={item}
                    isAuthenticated={!!user}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
