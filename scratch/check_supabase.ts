import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://rcyawirhtprbuiipaxyg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjeWF3aXJodHByYnVpaXBheHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MzQ3OTYsImV4cCI6MjA5MjQxMDc5Nn0.o-zTtloVYwbpgr0GXy75O8VAbvQb49fPJ3S4lxAf52c'
);

async function checkSchema() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  console.log('Product Data:', data);
  console.log('Error:', error);
}

checkSchema();
