"use server";

import mongoose from "mongoose";
import { z } from "zod";
import { Contact } from "@/models/Contact";

const uri = process.env.MONGODB_URI;

const connect = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  await mongoose.connect(uri!);
};

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

export async function submitContact(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  const result = formSchema.safeParse({ name, email, message });

  if (!result.success) {
    return {
      success: false,
      message: "Invalid form data. Please check your inputs.",
    };
  }

  try {
    connect();

    const newContact = new Contact(result.data);
    await newContact.save();

    return { success: true, message: "Form submitted successfully!" };
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      success: false,
      message: "An error occurred while submitting the form.",
    };
  }
}
