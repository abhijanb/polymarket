import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateMarketMutation } from "../api/marketApi";

export function useCreateMarket() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Crypto");
  const [resolutionDate, setResolutionDate] = useState("");
  const [oracleUrl, setOracleUrl] = useState("");
  const [description, setDescription] = useState("");

  const [createMarket, { isLoading }] = useCreateMarketMutation();

  const handleLaunch = async () => {
    try {
      await createMarket({
        title,
        description,
        category,
        resolutionDate,
        oracleUrl,
      }).unwrap();
      navigate("/admin/markets");
    } catch (err) {
      console.error("[handleLaunch]", err);
    }
  };

  const handleSaveDraft = async () => {
    try {
      await createMarket({
        title,
        description,
        category,
        resolutionDate,
        oracleUrl,
      }).unwrap();
      navigate("/admin/markets");
    } catch (err) {
      console.error("[handleSaveDraft]", err);
    }
  };

  return {
    title, setTitle,
    category, setCategory,
    resolutionDate, setResolutionDate,
    oracleUrl, setOracleUrl,
    description, setDescription,
    handleLaunch, handleSaveDraft, isLoading,
  };
}
