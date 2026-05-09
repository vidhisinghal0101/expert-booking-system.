import { useState, useEffect, useCallback } from 'react';
import { fetchExperts, fetchExpertById } from '../api/experts';

export const useExperts = (params) => {
  const [experts, setExperts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchExperts(params);
      if (res.data && Array.isArray(res.data.experts)) {
        setExperts(res.data.experts);
        setTotal(res.data.total || 0);
        setPage(res.data.page || 1);
        setTotalPages(res.data.totalPages || 1);
      } else {
        throw new Error('Invalid response from server. Please check your API URL.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    load();
  }, [load]);

  return { experts, total, page, totalPages, loading, error, refetch: load };
};

export const useExpertById = (id) => {
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchExpertById(id);
      setExpert(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // Allow external updates (e.g., from socket events)
  const updateSlot = useCallback((date, timeSlot) => {
    setExpert((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        availableSlots: prev.availableSlots.map((slot) =>
          slot.date === date && slot.time === timeSlot
            ? { ...slot, isBooked: true }
            : slot
        )
      };
    });
  }, []);

  return { expert, loading, error, refetch: load, updateSlot };
};
