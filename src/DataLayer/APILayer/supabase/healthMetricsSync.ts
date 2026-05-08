/**
 * Mirror + read model for daily health metrics in Supabase (`payload` = full daily snapshot).
 * Reads: `tryFetchDailyMetricsFromSupabase` in `userQueries.ts` (fallback when no JWT or backend errors).
 * Writes: `syncHealthDailyMetricsToSupabase` after a successful Java API response (see `HealthPage`).
 *
 * Run in Supabase SQL editor (adjust names if you prefer):
 *
 * create table if not exists public.health_daily_metrics (
 *   user_id uuid not null references auth.users (id) on delete cascade,
 *   day date not null,
 *   payload jsonb not null,
 *   synced_at timestamptz not null default now(),
 *   primary key (user_id, day)
 * );
 * alter table public.health_daily_metrics enable row level security;
 * create policy "health_daily_metrics_own"
 *   on public.health_daily_metrics for all
 *   using (auth.uid() = user_id) with check (auth.uid() = user_id);
 */
import type { DailyMetricsResponse } from '../userQueries';
import { getSupabase } from './supabaseClient';

export async function syncHealthDailyMetricsToSupabase(metrics: DailyMetricsResponse): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user?.id) return;

  const { error } = await supabase.from('health_daily_metrics').upsert(
    {
      user_id: session.user.id,
      day: metrics.date,
      payload: metrics as unknown as Record<string, unknown>,
      synced_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,day' }
  );

  if (error) {
    console.warn('[health] Supabase mirror skipped:', error.message);
  }
}
