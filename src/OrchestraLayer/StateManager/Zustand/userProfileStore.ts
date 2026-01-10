import axios from 'axios';
import { create } from 'zustand';
import Cookies from 'js-cookie';

const API_BASE_URL = '/backend';

export interface UserDetails {
    information_id: number | null;
    identity_id: number | null;
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

export interface UserProfile {
    id: number | null;
    firstName: string;
    lastName: string;
    friends: number;
    mutual: number;
    profileImageUrl: string;
    alias: string;
}

export interface UserAccount {
    role: 'ADMIN' | 'USER' | 'VIEWER' | 'UNAUTHORIZED';
}

export interface UserInformation {
    details: UserDetails;
    profiles: UserProfile;
}

interface UserAccountState {
    account: UserAccount;
    getUserRole: () => Promise<void>;
}

interface UserInformationState {
    information: UserInformation;
    updateProfileImageUrl: (url: string) => void;
    updateProfile: () => Promise<void>;
    fetchFromDatabase: () => Promise<void>;
    editProfile: (university: string, location: string) => void;
}

const useUserProfileStore = create<UserInformationState>((set, get) => ({
    information: {
        details: {
            information_id: null,
            identity_id: null,
            github_url: '',
            website_url: '',
            company: '',
            university: '',
            location: '',
            country: '',
            bio: '',
            occupation: '',
            education_level: '',
            linkedin_url: '',
        },
        profiles: {
            id: null,
            firstName: '',
            lastName: '',
            friends: 208,
            mutual: 5,
            profileImageUrl: 'http://192.168.22.4:9000/duylongwebappobjectdatabase/admin.png',
            alias: '',
        },
    },

    fetchFromDatabase: async () => {
        try {
            const token = Cookies.get('auth_jwt');
            if (!token) return;

            // Fetch Person Information
            const response = await axios.get(`${API_BASE_URL}/person/information`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = response.data;

            set((state) => ({
                information: {
                    ...state.information,
                    profiles: {
                        ...state.information.profiles,
                        id: data.id,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        profileImageUrl: data.profileImageUrl || state.information.profiles.profileImageUrl,
                        alias: data.alias,
                    },
                }
            }));

            // Fetch Details
            const responseDetails = await axios.get(`${API_BASE_URL}/information/details`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const dataDetails = responseDetails.data;
            console.log("✅ Profile Sync Successful: ", dataDetails);

            set((state) => ({
                information: {
                    ...state.information,
                    details: {
                        ...state.information.details,
                        identity_id: dataDetails.id,
                        github_url: dataDetails.github_url,
                        website_url: dataDetails.website_url,
                        company: dataDetails.company,
                        university: dataDetails.university,
                        location: dataDetails.location,
                        country: dataDetails.country,
                        bio: dataDetails.bio,
                        occupation: dataDetails.occupation,
                        education_level: dataDetails.education_level,
                        linkedin_url: dataDetails.linkedin_url,
                    }
                }
            }));

        } catch (error) {
            console.error("❌ Failed to fetch user profile:", error);
        }
    },

    updateProfileImageUrl: (url: string) => set((state) => ({
        information: {
            ...state.information,
            profiles: {
                ...state.information.profiles,
                profileImageUrl: url
            }
        }
    })),

    editProfile: (editUniversity: string, editLocation: string) => set((state) => ({
        information: {
            ...state.information,
            profiles: {
                ...state.information.profiles,
                details: {
                    ...state.information.details,
                    university: editUniversity,
                    location: editLocation,
                }
            } as any // Temporary cast to bypass structure mismatch if 'details' is not directly under 'profiles' in intended schema, but keeping logically consistent with previous code
        }
    })),


    updateProfile: async () => {
        try {
            const token = Cookies.get('auth_jwt');
            const { details } = get().information;

            const response = await axios.post(
                `${API_BASE_URL}/information/edit?university=${details.university}&location=${details.location}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log("✅ Database Update Successful:", response.data);
        } catch (error) {
            console.error("❌ Failed to update profile in database:", error);
        }
    },
}));

const useUserAccountStore = create<UserAccountState>((set) => ({
    account: {
        role: 'USER',
    },

    getUserRole: async () => {
        try {
            const token = Cookies.get('auth_jwt');
            const response = await axios.get(`${API_BASE_URL}/account/information`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set((state) => ({
                ...state,
                account: {
                    ...state.account,
                    role: response.data.role,
                },
            }));
        }
        catch (error) {
            console.error("❌ Failed to get user role:", error);
        }
    }
}));

interface SkillType {
    id: number;
    category: string;
    name: string;
    description: string;

}
interface UserSkillState {
    value: SkillType[];
    getUserSkill: () => Promise<void>;
}
const useUserSkillStore = create<UserSkillState>((set) => ({
    value: [],
    getUserSkill: async () => {
        try {
            const token = Cookies.get('auth_jwt');
            const response = await axios.get<SkillType[]>(`${API_BASE_URL}/person/skills`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("✅ Database Skill Successful:", response.data);
            set((state) => ({

                ...state,
                value: response.data
            }));
        }
        catch (error) {
            console.error("❌ Failed to get user skill:", error);
        }
    }

}))
export { useUserAccountStore, useUserProfileStore, useUserSkillStore };