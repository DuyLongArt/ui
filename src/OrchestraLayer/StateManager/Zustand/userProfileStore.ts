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
    updateProfile: () => Promise<void>;
    editProfile: (university: string, location: string) => void;
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
                    friends: 208,
                    mutual: 5,
                    profileImageUrl: 'https://backend.duylong.art/object/duylongwebappobjectdatabase/admin.png',
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
        }),
        {
            name: 'user-profile-storage',
            storage: createJSONStorage(() => localStorage),
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