interface Product {
  id: string;
  p_name: string;
  p_image: string[]; // Changed to an array of images
  p_date: string;
  p_url: string;
  p_likes: number;
  p_owner: string;
  p_price: string;
  p_short: string;
  p_desc: string;
  p_pickup: string;
  p_liked: string;
  p_category: string[];
  p_user_image: string;
  p_reviews: {
    review_text: string;
    review_stars: number;
    reviewer_name: string;
  }[];
  p_stars: number;
}

interface Items {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  status: string;
  created_at: string;
  updated_at: string;
  seller_name: string;
  images: string[];
  condition: string;
}

interface Image {
  id: number;
  image_url: string;
}

interface ListingItem {
  id: number;
  title: string;
  description: string;
  price: string;
  location: string;
  status: string;
  created_at: string;
  seller_name: string;
  images: Image[];
}
