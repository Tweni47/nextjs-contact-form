"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitContact } from "@/lib/actions/submitContact";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: FormData) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    const result = await submitContact(formData);
    setServerMessage(result.message);
    if (result.success) {
      reset();
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4 text-center">Contact Our Team</h2>
      <p className="mb-6 text-center text-zinc-400">
        Get in touch with our friendly team and we will get back within 2 hours.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-lg font-semibold">
            Name
          </Label>
          <Input id="name" {...register("name")} placeholder="John Doe" />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-lg font-semibold">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="johndoe@mail.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="message" className="text-lg font-semibold">
            Message
          </Label>
          <Textarea
            id="message"
            {...register("message")}
            placeholder="Enter your message"
            className="min-h-[100px]"
          />
          {errors.message && (
            <p className="text-red-500 text-sm">{errors.message.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full font-semibold">
          Send Message
        </Button>
      </form>
      {serverMessage && (
        <p
          className={`mt-4 text-center ${
            serverMessage.includes("successfully")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {serverMessage}
        </p>
      )}
    </div>
  );
}
