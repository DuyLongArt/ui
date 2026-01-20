import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = '/backend';

// Types (Mirrored from userProfileStore.ts to avoid circular deps or re-definitions)
export interface UserProfileResponse {
    id: number;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
    alias: string;
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

// Fetchers
const fetchPersonInformation = async () => {
    const token = Cookies.get('auth_jwt');
    if (!token) throw new Error('No auth token');
    const { data } = await axios.get<UserProfileResponse>(`${API_BASE_URL}/person/information`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

const fetchInformationDetails = async () => {
    const token = Cookies.get('auth_jwt');
    if (!token) throw new Error('No auth token');
    const { data } = await axios.get<UserDetailsResponse>(`${API_BASE_URL}/information/details`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

const fetchUserAccount = async () => {
    const token = Cookies.get('auth_jwt');
    // If no token, we might not want to throw, or handle it gracefully. 
    // Assuming protected route, throw is fine.
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
export const usePersonInformationQuery = () => {
    return useQuery({
        queryKey: ['person', 'information'],
        queryFn: fetchPersonInformation,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useInformationDetailsQuery = () => {
    return useQuery({
        queryKey: ['information', 'details'],
        queryFn: fetchInformationDetails,
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
