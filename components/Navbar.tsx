import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiSearch, FiUser, FiPlusCircle } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="w-full h-16 bg-gray-100 flex justify-between items-center px-6 shadow-md">
      {/* Logo */}
      <Link href="/listings">
        <Image src="/next.svg" alt="logo" width={100} height={40} />
      </Link>

      {/* Search Bar */}
      <div className="flex items-center bg-white rounded-md shadow-sm px-4 py-2 w-1/2 text-gray-700">
        <input
          type="text"
          placeholder="Search listings..."
          className="w-full outline-none text-sm bg-transparent"
        />
        <FiSearch className="text-gray-500 text-lg cursor-pointer" />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        <Link
          href="/add-listing"
          className="flex items-center text-blue-600 text-sm font-semibold"
        >
          <FiPlusCircle className="text-lg" />
          <span className="ml-1">Add Listing</span>
        </Link>

        <Link
          href="/profile"
          className="flex items-center text-gray-600 text-sm font-semibold"
        >
          <FiUser className="text-lg" />
          <span className="ml-1">Profile</span>
        </Link>

        <Link
          href="/profile"
          className="flex items-center text-gray-600 text-sm font-semibold"
        >
          <FaRegHeart className="text-lg text-red-500" />
          <span className="ml-1">Liked</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
