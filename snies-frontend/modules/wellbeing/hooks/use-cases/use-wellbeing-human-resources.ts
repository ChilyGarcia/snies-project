import { useEffect, useState } from "react";
import type { WellbeingHumanResourceRepository } from "../ports/wellbeing-human-resource.repository";
import type { WellbeingHumanResource } from "@/modules/wellbeing/types/human-resource";

export function useWellbeingHumanResources(repository: WellbeingHumanResourceRepository) {
  const [items, setItems] = useState<WellbeingHumanResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async (params?: { year?: string; semester?: number }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await repository.list(params);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setItems([]);
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return { items, loading, error, refetch: fetchItems, setItems };
}

