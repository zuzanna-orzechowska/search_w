import { Client, Account} from 'appwrite';

export const client = new Client();

client
    .setEndpoint(process.env.VUE_APP_APPWRITE_ENDPOINT)
    .setProject(process.env.VUE_APP_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export { ID } from 'appwrite';
