"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const schema = z
  .object({
    email: z.string().email("Podaj poprawny adres e-mail"),
    password: z.string().min(6, "Hasło musi mieć min. 6 znaków"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła muszą być identyczne",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(json.error || "Rejestracja nie powiodła się.");
        return;
      }

      // If server returned a user, we are logged in. Otherwise show info message.
      if (json.user) {
        toast.success("Konto utworzone. Zalogowano automatycznie.");
        window.location.href = "/";
        return;
      }

      toast.success(json.message || "Konto utworzone. Sprawdź pocztę w celu potwierdzenia.");
    } catch (e) {
      toast.error("Rejestracja nie powiodła się. Spróbuj ponownie.");
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} aria-label="Formularz rejestracji">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          E-mail
        </label>
        <Input
          id="email"
          type="email"
          placeholder="jan@firma.pl"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-600" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Hasło
        </label>
        <Input id="password" type="password" aria-invalid={!!errors.password} {...register("password")} />
        {errors.password && (
          <p className="text-xs text-red-600" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Potwierdź hasło
        </label>
        <Input
          id="confirmPassword"
          type="password"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-600" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-600">
          Masz już konto?{" "}
          <a href="/auth/login" className="hover:underline">
            Zaloguj się
          </a>
        </p>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Rejestracja…" : "Zarejestruj się"}
        </Button>
      </div>
    </form>
  );
}
