import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getSupabase } from './supabase/supabaseClient';
import { tryFetchDetailsFromSupabase, tryFetchProfilesFromSupabase } from './supabase/userInformationSync';

const API_BASE_URL = '/backend';

// Types (Mirrored from userProfileStore.ts to avoid circular deps or re-definitions)
export interface UserProfileResponse {
    id: number;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
    alias: string;
    friends: number;
}

export interface UserDetailsResponse {
    id: number;
    github_url: string;
    website_url: string;
    company: string;
    university: string;
    location: string;
    country: string;
    bio: string;
    occupation: string;
    education_level: string;
    linkedin_url: string;
}

export interface UserAccountResponse {
    role: 'ADMIN' | 'USER' | 'VIEWER' | 'UNAUTHORIZED';
    deviceIP: string;
}

export interface SkillType {
    id: number;
    category: string;
    name: string;
    description: string;
}

export interface UserScoreResponse {
    id: number;
    healthGlobalScore: number;
    socialGlobalScore: number;
    financialGlobalScore: number;
    careerGlobalScore: number;
}

export interface QuestResponse {
    id: string;
    title: string;
    description: string;
    targetValue: number;
    currentValue: number;
    category: 'HEALTH' | 'SOCIAL' | 'FINANCE' | 'PROJECT' | 'FEAT';
    rewardExp: number;
    isCompleted: boolean;
    createdAt: string;
}

export interface DailyMetricsResponse {
    date: string;
    steps: number;
    heartRateAvg: number;
    sleepHours: number;
    waterMl: number;
    exerciseMinutes: number;
    focusMinutes: number;
    caloriesConsumed: number;
    caloriesBurned: number;
    weightKg: number;
    updatedAt: string;
}

// Fetchers
const fetchUserScores = async () => {
    const token = Cookies.get('auth_jwt');
    if (!token) throw new Error('No auth token');
    const { data } = await axios.get<UserScoreResponse>(`${API_BASE_URL}/system/scores`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

const fetchUserQuests = async (completed?: boolean) => {
    const token = Cookies.get('auth_jwt');
    if (!token) throw new Error('No auth token');
    const { data } = await axios.get<QuestResponse[]>(`${API_BASE_URL}/system/quests`, {
        params: completed !== undefined ? { completed } : {},
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

/** Prefer `public.health_daily_metrics` when Supabase + session are available (see `healthMetricsSync.ts` SQL). */
async function tryFetchDailyMetricsFromSupabase(date?: string): Promise<DailyMetricsResponse | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user?.id) return null;

    const day = date ?? new Date().toISOString().slice(0, 10);

    const { data, error } = await supabase
        .from('health_daily_metrics')
        .select('payload')
        .eq('user_id', session.user.id)
        .eq('day', day)
        .maybeSingle();

    if (error) {
        console.warn('[health] Supabase read:', error.message);
        return null;
    }

    const payload = data?.payload as DailyMetricsResponse | undefined;
    if (!payload || typeof payload !== 'object' || typeof payload.date !== 'string') {
        return null;
    }
    return payload;
}

const fetchDailyMetrics = async (date?: string) => {
    const token = Cookies.get('auth_jwt');
    const fromSupabase = await tryFetchDailyMetricsFromSupabase(date);

    if (token) {
        try {
            const { data } = await axios.get<DailyMetricsResponse>(`${API_BASE_URL}/health/metrics/daily`, {
                params: date ? { date } : {},
                headers: { Authorization: `Bearer ${token}` },
                timeout: 8000,
            });
            return data;
        } catch (e) {
            if (fromSupabase) return fromSupabase;
            throw e;
        }
    }

    if (fromSupabase) return fromSupabase;
    throw new Error('No auth token');
};

const fetchPersonInformation = async (alias?: string) => {
    if (!alias) {
        const fromSb = await tryFetchProfilesFromSupabase();
        const token = Cookies.get('auth_jwt');
        if (token) {
            try {
                const { data } = await axios.get<UserProfileResponse>(`${API_BASE_URL}/person/information`, {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 8000,
                });
                return data;
            } catch (e) {
                if (fromSb) return fromSb;
                throw e;
            }
        }
        if (fromSb) return fromSb;
        throw new Error('No auth token');
    }

    const token = Cookies.get('auth_jwt');
    const { data } = await axios.get<UserProfileResponse>(`${API_BASE_URL}/person/information/${alias}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        timeout: 8000,
    });
    return data;
};

const fetchInformationDetails = async (alias?: string) => {
    if (!alias) {
        const fromSb = await tryFetchDetailsFromSupabase();
        const token = Cookies.get('auth_jwt');
        if (token) {
            try {
                const { data } = await axios.get<UserDetailsResponse>(`${API_BASE_URL}/information/details`, {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 8000,
                });
                return data;
            } catch (e) {
                if (fromSb) return fromSb;
                throw e;
            }
        }
        if (fromSb) return fromSb;
        throw new Error('No auth token');
    }

    const token = Cookies.get('auth_jwt');
    const { data } = await axios.get<UserDetailsResponse>(`${API_BASE_URL}/information/details/${alias}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        timeout: 8000,
    });
    return data;
};

const fetchUserAccount = async () => {
    const token = Cookies.get('auth_jwt');
    if (!token) throw new Error('No auth token');
    const { data } = await axios.get<UserAccountResponse>(`${API_BASE_URL}/account/information`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

const fetchUserSkills = async () => {
    const token = Cookies.get('auth_jwt');
    if (!token) throw new Error('No auth token');
    const { data } = await axios.get<SkillType[]>(`${API_BASE_URL}/person/skills`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

// Hooks
export const useUserScoresQuery = () => {
    return useQuery({
        queryKey: ['system', 'scores'],
        queryFn: fetchUserScores,
        staleTime: 1000 * 60 * 5,
    });
};

export const useUserQuestsQuery = (completed?: boolean) => {
    return useQuery({
        queryKey: ['system', 'quests', completed],
        queryFn: () => fetchUserQuests(completed),
        staleTime: 1000 * 60 * 5,
    });
};

export const useDailyMetricsQuery = (date?: string) => {
    return useQuery({
        queryKey: ['health', 'metrics', 'daily', date || 'today'],
        queryFn: () => fetchDailyMetrics(date),
        staleTime: 1000 * 60 * 1, // 1 minute
    });
};

export const usePersonInformationQuery = (alias?: string) => {
    return useQuery({
        queryKey: ['person', 'information', alias || 'me'],
        queryFn: () => fetchPersonInformation(alias),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useInformationDetailsQuery = (alias?: string) => {
    return useQuery({
        queryKey: ['information', 'details', alias || 'me'],
        queryFn: () => fetchInformationDetails(alias),
        staleTime: 1000 * 60 * 5,
    });
};

export const useUserAccountQuery = () => {
    return useQuery({
        queryKey: ['account', 'information'],
        queryFn: fetchUserAccount,
        staleTime: 1000 * 60 * 5,
    });
};

export const useUserSkillsQuery = () => {
    return useQuery({
        queryKey: ['person', 'skills'],
        queryFn: fetchUserSkills,
        staleTime: 1000 * 60 * 5,
    });
};

// Mutations
export const useAddHydrationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (amountMl: number) => {
            const token = Cookies.get('auth_jwt');
            const { data } = await axios.post(`${API_BASE_URL}/health/metrics/hydration/add`, null, {
                params: { amountMl },
                headers: { Authorization: `Bearer ${token}` },
                timeout: 8000,
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['health', 'metrics', 'daily'] });
        }
    });
};

export const useUpdateAvatarMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (file: File) => {
            const token = Cookies.get('auth_jwt');
            const formData = new FormData();
            formData.append('file', file);
            const { data } = await axios.post(`${API_BASE_URL}/person/avatar/update`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['person', 'information'] });
        }
    });
};

export const useUpdateCoverMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (file: File) => {
            const token = Cookies.get('auth_jwt');
            const formData = new FormData();
            formData.append('file', file);
            const { data } = await axios.post(`${API_BASE_URL}/person/cover/update`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['person', 'information'] });
        }
    });
};

export const useEditInformationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: { university: string; location: string }) => {
            const token = Cookies.get('auth_jwt');
            const { data } = await axios.post(`${API_BASE_URL}/information/edit`, null, {
                params,
                headers: { Authorization: `Bearer ${token}` }
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['information', 'details'] });
        }
    });
};

export const useAppSyncMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const token = Cookies.get('auth_jwt');
            const { data } = await axios.get(`${API_BASE_URL}/person/app_sync`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['person', 'information'] });
            queryClient.invalidateQueries({ queryKey: ['information', 'details'] });
        }
    });
};

export interface FeedbackRequest {
    name?: string;
    type: string;
    message: string;
}

export const useSubmitFeedbackMutation = () => {
    return useMutation({
        mutationFn: async (feedback: FeedbackRequest) => {
            const token = Cookies.get('auth_jwt');
            const { data } = await axios.post(`${API_BASE_URL}/support/feedback`, feedback, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return data;
        }
    });
};
