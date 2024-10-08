export interface User {
  username: string;
  first_name: string;
  surname: string;
  city: string;
  profile_picture?: string | null;
}

export interface DJ extends User {
  genres: string[];
  occasions: string[];
  price: number;
  description: string;
  rating: number;
}

export interface Feedback {
  author: string;
  body: string;
  date: Date;
  dj: string;
  stars: number;
  title: string;
}
export interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface Bookings {
  client: string;
  comments: string;
  event_details: string;
  date: Date | FirebaseTimestamp;
  dj: string;
  location: string;
  occasion: string;
}

export interface Booking {
  id: string;
  client: string;
  dj: string;
  comments: string;
  event_details: string;
  date: Date;
  time: string;
  location: string;
  occasion: string;
  status: 'pending' | 'accepted' | 'declined';
}
