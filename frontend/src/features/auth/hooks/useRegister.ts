import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/features/auth/lib/schemas";
import { useRegisterMutation } from "@/features/auth/api/authApi";

export function useRegister() {
  const [registerMut, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    try {
      const res = await registerMut({ email: data.email, password: data.password, name: data.name || undefined }).unwrap();
      const role = res.user.role;
      navigate(role === "ADMIN" ? "/admin" : "/user");
    } catch (e: any) {
      const msg = e?.data?.errors?.[0]?.message || e?.data?.message || e?.message || "Registration failed";
      setServerError(msg);
    }
  };

  return { form, onSubmit, serverError, isLoading };
}
