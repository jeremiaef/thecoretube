import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rijstjwturtjcvdodkfh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpanN0and0dXJ0amN2ZG9ka2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNTk5MjYsImV4cCI6MjA4NjgzNTkyNn0.c6hDtGRgV00KT0vCrF0JAok6zYDdGvOgj_6kFNsWi0g";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);