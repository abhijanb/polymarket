import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useCreateMarketMutation } from "../api/marketApi";
import { extractFieldErrors, toApiDatetime } from "@/shared/api/errors";
import { createMarketSchema, type CreateMarketInput } from "../lib/schemas";

export function useCreateMarket() {
  const navigate = useNavigate();
  const [createMarket, { isLoading, error }] = useCreateMarketMutation();

  const form = useForm<CreateMarketInput>({
    resolver: zodResolver(createMarketSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Crypto",
      resolutionDate: "",
      oracleUrl: "",
    },
  });

  const doSubmit = async (data: CreateMarketInput, label: string) => {
    try {
      await createMarket({
        ...data,
        resolutionDate: toApiDatetime(data.resolutionDate),
      }).unwrap();
      navigate("/admin/markets");
    } catch (err) {
      const fieldErrors = extractFieldErrors(err);
      if (Object.keys(fieldErrors).length > 0) {
        for (const [field, message] of Object.entries(fieldErrors)) {
          form.setError(field as keyof CreateMarketInput, { type: "server", message });
        }
      } else {
        console.error(label, err);
      }
    }
  };

  const handleLaunch = form.handleSubmit((data) => doSubmit(data, "[handleLaunch]"));
  const handleSaveDraft = form.handleSubmit((data) => doSubmit(data, "[handleSaveDraft]"));

  const watchedFields = form.watch();

  return {
    form,
    handleLaunch,
    handleSaveDraft,
    saving: isLoading,
    isLoading,
    error,
    title: watchedFields.title,
    category: watchedFields.category,
    resolutionDate: watchedFields.resolutionDate,
  };
}
