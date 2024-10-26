export interface Post {
  _id: string;
  title: string;
  body: string | string[];
  category: string;
  image: string;
  labels: Record<string, string | string[]>;
  deadline?: string;
  location?: string;
  email?: string;
  phone?: string;
  link?: string;
  linkedin?: string;
  instagram?: string;
  experience?: string[];
  education?: string[];
  responsibilities?: string[];
  requirements?: string[];
  expired?: boolean;
  daysLeft?: number;
  updatedAt?: string | Date;
}
