export interface Post {
  _id: string;
  title: string;
  category: string;
  image: string;
  link: string;
  body?: string | string[];
  deadline?: string;
  location?: string;
  email?: string;
  phone?: string;
  labels: {
    [key: string]: string | string[];
    Organization?: string | string[];
    Company?: string | string[];
    'Mentoring Topic'?: string | string[];
  };
  linkedin?: string;
  instagram?: string;
  experience?: string[];
  education?: string[];
  responsibilities?: string[];
  requirements?: string[];
  expired?: boolean;
  daysLeft?: number;
}
