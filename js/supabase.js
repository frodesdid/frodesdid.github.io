// js/supabase.js короче база данных и ключи

const SUPABASE_URL = 'https://fggfkxnjahgrkrewhjzhk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZ2ZreG5qYWhncmtyZXdqaHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxMTQ5MjEsImV4cCI6MjA5ODY5MDkyMX0.yZRC_ozL3cmezyv_GvuU35sciW046k5YclopBfcyL0M';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
