// Supabase client configuration for Software Factory
// Environment variables required:
// - PUBLIC_SUPABASE_URL
// - PUBLIC_SUPABASE_ANON_KEY

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Missing configuration. Some features may not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types for TypeScript
export interface RegisteredRepo {
  id: string;
  owner: string;
  name: string;
  visibility: 'public' | 'private';
  installed_at: string;
  protocol_version: string;
  last_ping: string;
  subscription_tier: 'free' | 'starter' | 'pro' | 'team';
}

export interface Metric {
  id: string;
  repo_id: string;
  metric_type: 'issues' | 'prs' | 'jules_session' | 'orchestration';
  value: number;
  timestamp: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  tier: 'free' | 'starter' | 'pro' | 'team';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: string | null;
  orchestrations_used: number;
  orchestrations_limit: number;
}

// Helper functions
export async function registerRepo(owner: string, name: string, visibility: 'public' | 'private') {
  const { data, error } = await supabase
    .from('registered_repos')
    .upsert({
      owner,
      name,
      visibility,
      installed_at: new Date().toISOString(),
      last_ping: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getRepoMetrics(repoId: string) {
  const { data, error } = await supabase
    .from('metrics')
    .select('*')
    .eq('repo_id', repoId)
    .order('timestamp', { ascending: false })
    .limit(100);

  if (error) throw error;
  return data;
}

export async function recordMetric(repoId: string, metricType: Metric['metric_type'], value: number) {
  const { error } = await supabase
    .from('metrics')
    .insert({
      repo_id: repoId,
      metric_type: metricType,
      value,
      timestamp: new Date().toISOString(),
    });

  if (error) throw error;
}

export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data;
}
