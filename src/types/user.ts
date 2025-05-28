
export interface User {
  id: string;
  name: string;
  email: string;
  role: string; // Changed from "user" | "admin" to string to match Supabase
  created_at?: string;
  updated_at?: string;
}
