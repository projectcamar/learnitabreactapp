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
    // Remove the index signature and explicitly define all possible label types
    Organization?: string | string[];
    Company?: string | string[];
    'Mentoring Topic'?: string[];
    // Add any other specific label types you need
    [key: string]: string | string[] | undefined; // Make the index signature accept undefined
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
