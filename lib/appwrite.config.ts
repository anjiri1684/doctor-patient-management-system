import * as sdk from 'node-appwrite';

export const {
  NEXT_PUBLIC_ENDPOINT,
  NEXT_PUBLIC_PROJECT_ID,
  NEXT_PUBLIC_API_KEY,
  NEXT_PUBLIC_DATABASE_ID,
  NEXT_PUBLIC_PATIENT_COLLECTION_ID,
  NEXT_PUBLIC_DOCTOR_COLLECTION_ID,
  NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID,
  NEXT_PUBLIC_ADMIN_PASSKEY,
} = process.env;


console.log("appwrite", process.env.NEXT_PUBLIC_ENDPOINT);
console.log("appwrite", process.env.NEXT_PUBLIC_PROJECT_ID);
console.log("appwrite", process.env.NEXT_PUBLIC_API_KEY);


const client = new sdk.Client();

if (!NEXT_PUBLIC_ENDPOINT || !NEXT_PUBLIC_PROJECT_ID || !NEXT_PUBLIC_API_KEY) {
  throw new Error("Missing Appwrite configuration: Check environment variables.");
}

client
  .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!)
  .setKey(process.env.NEXT_PUBLIC_API_KEY!);

export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);
