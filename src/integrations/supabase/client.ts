// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iiutqsyiuvpnqytzswlg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpdXRxc3lpdXZwbnF5dHpzd2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NDIwOTIsImV4cCI6MjA1MDExODA5Mn0.s7twYMGEzSuVn7iAO8jpBgqd7qNQMBZMZ3p8hUpyQOU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);