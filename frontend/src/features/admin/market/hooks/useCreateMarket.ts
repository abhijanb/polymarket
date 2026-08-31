import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateMarketMutation } from "../api/marketApi";
import { extractFieldErrors, toApiDatetime } from "@/shared/api/errors";

export function useCreateMarket() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Crypto");
  const [resolutionDate, setResolutionDate] = useState("");
  const [oracleUrl, setOracleUrl] = useState("");
  const [description, setDescription] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [createMarket, { isLoading, error }] = useCreateMarketMutation();

  const handleLaunch = async () => {
    setFieldErrors({});
    try {
      await createMarket({
        title,
        description,
        category,
        resolutionDate: toApiDatetime(resolutionDate),
        oracleUrl,
      }).unwrap();
      navigate("/admin/markets");
    } catch (err) {
      setFieldErrors(extractFieldErrors(err));
      console.error("[handleLaunch]", err);
    }
  };

  const handleSaveDraft = async () => {
    setFieldErrors({});
    try {
      await createMarket({
        title,
        description,
        category,
        resolutionDate: toApiDatetime(resolutionDate),
        oracleUrl,
      }).unwrap();
      navigate("/admin/markets");
    } catch (err) {
      setFieldErrors(extractFieldErrors(err));
      console.error("[handleSaveDraft]", err);
    }
  };

  return {
    title, setTitle,
    category, setCategory,
    resolutionDate, setResolutionDate,
    oracleUrl, setOracleUrl,
    description, setDescription,
    handleLaunch, handleSaveDraft, isLoading, error, fieldErrors,
  };
}
