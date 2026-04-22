import { supabase } from './src/lib/supabase';

async function checkBuckets() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Erro ao listar buckets:', error);
  } else {
    console.log('Buckets encontrados:', data.map(b => b.name));
  }
}

checkBuckets();
