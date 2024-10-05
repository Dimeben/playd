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
  id: string;
}

export interface Feedback {
  author: string;
  body: string;
  booking_id: string;
  date: Date;
  dj: string;
  stars: number;
  title: string;
  id?: string;
}

export interface Bookings {
  client: string;
  comments: string;
  event_details: string;
  date: Date;
  dj: string;
  location: string;
  occasion: string;
}

export interface Booking {
  // id: string;
  dj: string;
  event_details: string;
  date: {
    seconds: number;
    nanoseconds: number;
  };
  location: string;
  status: string;
}

