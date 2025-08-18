import { Client, Account, Databases} from 'appwrite';
//import 'dotenv/config';

export const client = new Client();

client
    .setEndpoint(process.env.VUE_APP_APPWRITE_ENDPOINT)
    .setProject(process.env.VUE_APP_APPWRITE_PROJECT_ID)
    .setDevKey(process.env.VUE_APP_DEV_KEY);

export const account = new Account(client);
export const databases = new Databases(client);
export { ID } from 'appwrite';
