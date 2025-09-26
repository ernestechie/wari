import { type Database as DB } from "@/lib/supabase/generated.types";

// Expose generated types to be available globally.
declare global {
  export type Database = DB;
  export type Todo = DB["public"]["Tables"]["todos"]["Row"];
}
