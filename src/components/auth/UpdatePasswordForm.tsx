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
    password: z.string().min(6, "Hasło musi mieć min. 6 znaków"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła muszą być identyczne",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function UpdatePasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [info, setInfo] = React.useState<string | null>(null);

  async function onSubmit(values: FormValues) {
    try {
      const params = new URLSearchParams(window.location.search);
      const access_token = params.get("access_token") || undefined;

      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: values.password, access_token }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setInfo(json.error || "Wystąpił błąd. Spróbuj ponownie później.");
        toast.error(json.error || "Nie udało się zmienić hasła.");
        return;
      }

      setInfo("Hasło zostało zaktualizowane. Możesz się zalogować.");
      toast.success("Hasło zmienione pomyślnie.");
    } catch (e) {
      setInfo("Wystąpił błąd. Spróbuj ponownie później.");
      toast.error("Nie udało się zmienić hasła.");
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} aria-label="Ustaw nowe hasło">
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Nowe hasło
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
          Potwierdź nowe hasło
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
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Aktualizuję…" : "Ustaw nowe hasło"}
      </Button>
      {info && (
        <p className="text-xs text-neutral-600" role="status">
          {info}
        </p>
      )}
    </form>
  );
}
