export interface User {
    $id: string;
    name: string;
    email: string;
    emailVerification: boolean;
    phone: string;
    phoneVerification: boolean;
    prefs: Record<string, unknown>;
    registration: string;
    status: boolean;
    passwordUpdate: string;
    accessedAt: string;
}

