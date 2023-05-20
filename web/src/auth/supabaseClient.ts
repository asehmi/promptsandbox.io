// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import { useMemo } from 'react';
import { Database } from 'shared';

export const createSupabaseClient = () => {
	const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
	const SUPABASE_PUBLIC_KEY = import.meta.env.VITE_SUPABASE_PUBLIC_API;
	const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
	return supabase;
};

const useSupabase = () => {
	return useMemo(createSupabaseClient, []);
};

export default useSupabase;
