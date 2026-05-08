/**
 * Cross-device profile + details mirror (replaces relying only on localStorage for “information”).
 *
 * create table if not exists public.user_information (
 *   user_id uuid primary key references auth.users (id) on delete cascade,
 *   profiles jsonb not null default '{}',
 *   details jsonb not null default '{}',
 *   updated_at timestamptz not null default now()
 * );
 * alter table public.user_information enable row level security;
 * create policy "user_information_own"
 *   on public.user_information for all
 *   using (auth.uid() = user_id) with check (auth.uid() = user_id);
 */
import type { UserDetailsResponse, UserProfileResponse } from '../userQueries';
import { getSupabase } from './supabaseClient';

/** When Java profile has no name, use fields saved at Supabase sign-up (`user_metadata`). */
export async function tryBootstrapProfileFromAuthMetadata(): Promise<Partial<UserProfileResponse> | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data: fetched } = await supabase.auth.getUser();
  const user = fetched.user ?? session?.user ?? null;
  if (!user) return null;

  const m = (user.user_metadata || {}) as Record<string, unknown>;
  const full = String(m.full_name || m.name || '').trim();
  const fullParts = full ? full.split(/\s+/) : [];
  const first = (m.first_name ?? m.firstName ?? fullParts[0]) as string | undefined;
  const last = (m.last_name ?? m.lastName ?? (fullParts.length > 1 ? fullParts.slice(1).join(' ') : undefined)) as
    | string
    | undefined;
  const alias = (m.user_name ?? m.username ?? user.email?.split('@')[0]) as string | undefined;

  const firstTrim = String(first || '').trim();
  const aliasTrim = String(alias || '').trim();
  if (!firstTrim && !aliasTrim) return null;

  return {
    firstName: firstTrim || aliasTrim,
    lastName: String(last || '').trim(),
    alias: aliasTrim,
  };
}

export async function tryFetchProfilesFromSupabase(): Promise<UserProfileResponse | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user?.id) return null;

  const { data, error } = await supabase
    .from('user_information')
    .select('profiles')
    .eq('user_id', session.user.id)
    .maybeSingle();

  if (error) {
    console.warn('[profile] Supabase read profiles:', error.message);
    return null;
  }

  const p = data?.profiles as UserProfileResponse | undefined;
  if (!p || typeof p !== 'object' || typeof p.alias !== 'string' || typeof p.id !== 'number') return null;
  return p;
}

export async function tryFetchDetailsFromSupabase(): Promise<UserDetailsResponse | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user?.id) return null;

  const { data, error } = await supabase
    .from('user_information')
    .select('details')
    .eq('user_id', session.user.id)
    .maybeSingle();

  if (error) {
    console.warn('[profile] Supabase read details:', error.message);
    return null;
  }

  const d = data?.details as UserDetailsResponse | undefined;
  if (!d || typeof d !== 'object' || typeof d.id !== 'number') return null;
  return d;
}

export async function syncUserInformationToSupabase(
  profiles: UserProfileResponse,
  details: UserDetailsResponse
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user?.id) return;

  const meta = await tryBootstrapProfileFromAuthMetadata();
  const profilesMerged: UserProfileResponse = {
    ...profiles,
    firstName: profiles.firstName?.trim() || meta?.firstName?.trim() || '',
    lastName: profiles.lastName?.trim() || meta?.lastName?.trim() || '',
    alias: profiles.alias?.trim() || meta?.alias?.trim() || '',
  };

  const { error } = await supabase.from('user_information').upsert(
    {
      user_id: session.user.id,
      profiles: profilesMerged as unknown as Record<string, unknown>,
      details: details as unknown as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );

  if (error) {
    console.warn('[profile] Supabase mirror:', error.message);
  }
}
