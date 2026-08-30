import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetMarketByIdQuery, useUpdateMarketMutation } from "../api/marketApi";
import { updateMarketSchema, type UpdateMarketInput } from "../lib/schemas";

export function useEditMarket() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: market, isLoading } = useGetMarketByIdQuery(id!);
  const [updateMarket, { isLoading: saving }] = useUpdateMarketMutation();

  const form = useForm<UpdateMarketInput>({ resolver: zodResolver(updateMarketSchema) });

  useEffect(() => {
    if (market) {
      form.reset({
        title: market.title,
        description: market.description,
        category: market.category,
        resolutionDate: market.resolutionDate.slice(0, 16),
        oracleUrl: market.oracleUrl,
        status: market.status,
        resolvedOutcomeId: market.resolvedOutcomeId,
      });
    }
  }, [market, form]);

  const handleSubmit = async (data: UpdateMarketInput) => {
    try {
      await updateMarket({ id: id!, data }).unwrap();
      navigate(`/admin/markets/${id}`);
    } catch (err) {
      console.error("[update]", err);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/markets/${id}`);
  };

  return { form, handleSubmit: form.handleSubmit(handleSubmit), handleCancel, saving, isLoading, market };
}
