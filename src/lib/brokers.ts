import { supabase, Broker } from './supabase';

export async function getBrokerBySlug(slug: string): Promise<Broker | null> {
  const { data, error } = await supabase.from('brokers').select('*').eq('slug', slug).single();

  if (error) {
    console.error('Error fetching broker:', error);
    return null;
  }

  return data;
}

export async function getAllBrokers(): Promise<Broker[]> {
  const { data, error } = await supabase
    .from('brokers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching brokers:', error);
    return [];
  }

  return data || [];
}

export async function createBroker(
  broker: Omit<Broker, 'id' | 'created_at' | 'updated_at'>
): Promise<Broker | null> {
  const { data, error } = await supabase.from('brokers').insert([broker]).select().single();

  if (error) {
    console.error('Error creating broker:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateBroker(id: string, broker: Partial<Broker>): Promise<Broker | null> {
  const { data, error } = await supabase
    .from('brokers')
    .update({ ...broker, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating broker:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteBroker(id: string): Promise<boolean> {
  const { error } = await supabase.from('brokers').delete().eq('id', id);

  if (error) {
    console.error('Error deleting broker:', error);
    return false;
  }

  return true;
}
