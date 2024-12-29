/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";


import {
  NEXT_PUBLIC_BUCKET_ID,
  NEXT_PUBLIC_DATABASE_ID,
  NEXT_PUBLIC_ENDPOINT,
  NEXT_PUBLIC_PATIENT_COLLECTION_ID,
  NEXT_PUBLIC_PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";


export const createUser = async (user: CreateUserParams) => {
  try {
    const newuser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(newuser);
  } catch (error: any) {
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

// export const registerPatient = async ({
//   identificationDocument,
//   ...patient
// }: RegisterUserParams) => {
//   try {
//     let file;
//     if (identificationDocument) {
//       const inputFile =
//         identificationDocument &&
//         InputFile.fromBuffer(
//           identificationDocument?.get("blobFile") as Blob,
//           identificationDocument?.get("fileName") as string
//         );

//       file = await storage.createFile(NEXT_PUBLIC_BUCKET_ID!, ID.unique(), inputFile);
//     }

//     const newPatient = await databases.createDocument(
//       NEXT_PUBLIC_DATABASE_ID!,
//       NEXT_PUBLIC_PATIENT_COLLECTION_ID!,
//       ID.unique(),
//       {
//         identificationDocumentId: file?.$id ? file.$id : null,
//         identificationDocumentUrl: `${NEXT_PUBLIC_ENDPOINT}/storage/buckets/${NEXT_PUBLIC_BUCKET_ID}/files/${file?.$id}/view?project=${NEXT_PUBLIC_PROJECT_ID}`,
        
//         ...patient,
//       }
//     );

//     return parseStringify(newPatient);
//   } catch (error) {
//     console.error("An error occurred while creating a new patient:", error);
//   }
// };

export const registerPatient = async ({
  identificationDocument,
  gender,  // Extract the gender field separately
  ...patient
}: RegisterUserParams) => {
  try {
    // Ensure the gender is in the correct format
    const genderMapping = {
      "Male": "male",
      "Female": "female",
      "Other": "other",
    };

    const correctedGender = genderMapping[gender] || gender; 

    let file;
    if (identificationDocument) {
      const inputFile =
        identificationDocument &&
        InputFile.fromBuffer(
          identificationDocument?.get("blobFile") as Blob,
          identificationDocument?.get("fileName") as string
        );

      file = await storage.createFile(NEXT_PUBLIC_BUCKET_ID!, ID.unique(), inputFile);
    }

    // Pass the corrected gender and other patient fields to the createDocument function
    const newPatient = await databases.createDocument(
      NEXT_PUBLIC_DATABASE_ID!,
      NEXT_PUBLIC_PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: `${NEXT_PUBLIC_ENDPOINT}/storage/buckets/${NEXT_PUBLIC_BUCKET_ID}/files/${file?.$id}/view?project=${NEXT_PUBLIC_PROJECT_ID}`,
        gender: correctedGender,  // Use the corrected gender value
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};


export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      NEXT_PUBLIC_DATABASE_ID!,
      NEXT_PUBLIC_PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};