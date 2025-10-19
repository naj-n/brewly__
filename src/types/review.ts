export interface Review {
  id: string;
  reviewer_name: string;
  reviewer_email: string;
  cafe_name: string;
  address: string;
  noise: 'quiet' | 'medium' | 'loud';
  wifi: boolean;
  outlets: boolean;
  laptop_friendly: boolean;
  rush_hours: string;
  ambience: 'cozy' | 'bright' | 'minimal' | 'busy';
  overall: number; // 1-5
  notes: string;
  image_url?: string | null;
  created_at: string;
}

export interface SavedCafe {
  id: string;
  cafe_name: string;
  address: string;
  overall: number;
  notes: string;
}
