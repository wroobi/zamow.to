"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Podaj poprawny adres e-mail"),
  password: z.string().min(6, "Hasło musi mieć min. 6 znaków"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        toast.error("Nieprawidłowe dane logowania.");
        return;
      }

      toast.success("Zalogowano pomyślnie");
      // eslint-disable-next-line react-compiler/react-compiler
      window.location.href = "/";
    } catch {
      toast.error("Nie udało się zalogować. Spróbuj ponownie.");
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} aria-label="Formularz logowania">
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

      <div className="flex items-center justify-between">
        <a href="/auth/reset-password" className="text-xs text-neutral-600 hover:underline">
          Zapomniałeś hasła?
        </a>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logowanie…" : "Zaloguj się"}
        </Button>
      </div>

      <p className="text-xs text-neutral-600">
        Nie masz konta?{" "}
        <a href="/auth/register" className="hover:underline">
          Zarejestruj się
        </a>
      </p>
    </form>
  );
}
