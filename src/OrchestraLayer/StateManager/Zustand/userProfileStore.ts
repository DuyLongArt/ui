import axios from 'axios';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
    coverImageUrl: string;
    alias: string;
}

export interface UserAccount {
    role: 'ADMIN' | 'USER' | 'VIEWER' | 'UNAUTHORIZED';
    ip: string;
}

export interface UserInformation {
    details: UserDetails;
    profiles: UserProfile;
}

interface UserAccountState {
    account: UserAccount;
}

interface UserInformationState {
    information: UserInformation;
    updateProfileImageUrl: (url: string) => void;
    updateCoverImageUrl: (url: string) => void;
    setInformation: (info: UserInformation) => void;
    editProfileDetails: (details: Partial<UserDetails>) => void;
}

const useUserProfileStore = create<UserInformationState>()(
    persist(
        (set, get) => ({
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
                    friends: 0,
                    mutual: 0,
                    profileImageUrl: 'https://backend.duylong.art/object/duylongwebappobjectdatabase/admin.png',
                    coverImageUrl: '',
                    alias: '',
                },
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

            updateCoverImageUrl: (url: string) => set((state) => ({
                information: {
                    ...state.information,
                    profiles: {
                        ...state.information.profiles,
                        coverImageUrl: url
                    }
                }
            })),

            setInformation: (info: UserInformation) => set({ information: info }),

            editProfileDetails: (details: Partial<UserDetails>) => set((state) => ({
                information: {
                    ...state.information,
                    details: {
                        ...state.information.details,
                        ...details,
                    }
                }
            })),
        }),
        {
            // Local cache; canonical “me” profile/details can also live in Supabase (`user_information`) when configured.
            name: 'user-profile-storage',
            storage: createJSONStorage(() => localStorage),
            // Rehydration runs after first paint and can overwrite in-memory fixes — re-apply Supabase Auth names if still empty.
            onRehydrateStorage: () => () => {
                void import('../../../DataLayer/APILayer/supabase/userInformationSync').then(
                    async ({ tryBootstrapProfileFromAuthMetadata }) => {
                        const cur = useUserProfileStore.getState().information.profiles;
                        if (cur.firstName?.trim()) return;
                        const partial = await tryBootstrapProfileFromAuthMetadata();
                        if (!partial?.firstName?.trim()) return;
                        useUserProfileStore.setState((state) => ({
                            information: {
                                ...state.information,
                                profiles: {
                                    ...state.information.profiles,
                                    ...partial,
                                },
                            },
                        }));
                    }
                );
            },
        }
    )
);

const useUserAccountStore = create<UserAccountState>((set) => ({
    account: {
        role: 'USER',
        ip: ''
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
}
const useUserSkillStore = create<UserSkillState>()(
    persist(
        (set) => ({
            value: [],
        }),
        {
            name: 'user-skills-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
export { useUserAccountStore, useUserProfileStore, useUserSkillStore };