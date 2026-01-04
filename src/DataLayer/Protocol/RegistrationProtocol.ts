/**
 * Registration Protocol
 * Defines the data structure for user registration
 */

export type RoleTypes = 'USER' | 'ADMIN';

export type CountryType = 'VietName' | 'UnitedStates' | 'Japan' | 'UnitedKingdom' | 'Canada' | 'Australia' | 'Singapore' | 'Other';

export interface RegistrationPayload {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    bio: string;
    country: CountryType;
    role?: RoleTypes;
    device?: string;
    deviceIP?: string;
    location?: string;
}

export interface RegistrationResponse {
    success: boolean;
    message: string;
    userId?: string;
    token?: string;
}

export interface RegistrationError {
    field?: string;
    message: string;
    code?: string;
}
