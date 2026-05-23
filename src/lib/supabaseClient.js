// ─── Supabase Client Configuration ──────────────────────────────────────────
// This file initializes the Supabase client used throughout the app.
// All environment variables are loaded from your .env file (never hardcode secrets).
//
// Setup steps:
//   1. Copy .env.example → .env
//   2. Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from:
//      https://supabase.com/dashboard → Your Project → Settings → API

import { createClient } from '@supabase/supabase-js';

// Read credentials from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize and export the single shared Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// ─── Example: Fetch all rows from profiles table ─────────────────────────────
//
//   const { data, error } = await supabase
//     .from("profiles")
//     .select("*");
//
//   if (error) console.error(error);
//   else console.log(data);


// ─── Example: Insert a new expense into the expenses table ───────────────────
//
//   const { data, error } = await supabase
//     .from("expenses")
//     .insert([
//       {
//         amount,
//         description,
//         date,
//       },
//     ]);
//
//   if (error) console.error(error);
//   else console.log("Inserted:", data);
