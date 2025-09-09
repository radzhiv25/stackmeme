import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Add error handling for WebSocket connections
const originalSubscribe = client.subscribe;
client.subscribe = function (channels, callback) {
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