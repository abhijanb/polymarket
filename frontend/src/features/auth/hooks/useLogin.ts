import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/features/auth/lib/schemas";
import { useLoginMutation } from "@/features/auth/api/authApi";

export function useLogin() {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    try {
      await login({ email: data.email, password: data.password }).unwrap();
      navigate("/");
    } catch (e: any) {
      const msg = e?.data?.errors?.[0]?.message || e?.data?.message || e?.message || "Invalid credentials";
      setServerError(msg);
    }
  };

  return { form, onSubmit, serverError, isLoading };
}
