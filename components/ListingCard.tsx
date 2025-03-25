import Image from "next/image";
import Link from "next/link";
import React from "react";

const ListingCard = ({ item }: { item: ListingItem }) => {
  const {
    id,
    title,
    description,
    price,
    location,
    status,
    created_at,
    seller_name,
    images,
  } = item;

  return (
    <Link href={`/listings/${id}`} className="w-full">
      <div className="h-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden">
        <div className="relative aspect-square">
          <Image
            src={images[0].image_url}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px]">
            {title}
          </h3>
          <div className="flex flex-row justify-between items-center mt-2">
            <span className="text-lg font-bold text-primary">₹{price}</span>
            <span className="text-xs font-medium text-gray-600">
              {seller_name}
            </span>
          </div>
          <div className="flex flex-row justify-between items-center mt-2 text-xs text-gray-500">
            <span>{location}</span>
            <span>{new Date(created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
