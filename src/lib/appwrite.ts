import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

const client = new Client();

// Get environment variables with fallbacks
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || 'demo-project';

// Validate environment variables
if (!import.meta.env.VITE_APPWRITE_ENDPOINT) {
    console.warn('VITE_APPWRITE_ENDPOINT is not set. Using default endpoint:', endpoint);
}

if (!import.meta.env.VITE_APPWRITE_PROJECT_ID) {
    console.warn('VITE_APPWRITE_PROJECT_ID is not set. Using demo project ID. Please configure your environment variables.');
}

// Initialize Appwrite client
try {
    client
        .setEndpoint(endpoint)
        .setProject(projectId);
} catch (error) {
    console.error('Failed to initialize Appwrite client:', error);
}

// Add error handling for WebSocket connections
const originalSubscribe = client.subscribe;
client.subscribe = function (channels: string | string[], callback: (payload: any) => void) {
    try {
        return originalSubscribe.call(this, channels, callback);
    } catch (error) {
        console.warn('WebSocket connection error (this is normal when real-time is disabled):', error);
        // Return a no-op unsubscribe function
        return () => { };
    }
};

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, Query };
export default client;