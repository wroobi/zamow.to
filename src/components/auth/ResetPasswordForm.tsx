"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const schema = z.object({ email: z.string().email("Podaj poprawny adres e-mail") });
type FormValues = z.infer<typeof schema>;

export default function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [info, setInfo] = React.useState<string | null>(null);

  async function onSubmit(values: FormValues) {
    try {
      await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setInfo("Jeśli adres istnieje, wysłaliśmy instrukcje resetowania.");
      toast.success("Sprawdź skrzynkę pocztową, wysłaliśmy instrukcje.");
    } catch (e) {
      setInfo("Wystąpił błąd. Spróbuj ponownie później.");
      toast.error("Nie udało się wysłać instrukcji.");
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} aria-label="Formularz resetu hasła">
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
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Wysyłanie…" : "Zresetuj hasło"}
      </Button>
      {info && (
        <p className="text-xs text-neutral-600" role="status">
          {info}
        </p>
      )}
    </form>
  );
}
