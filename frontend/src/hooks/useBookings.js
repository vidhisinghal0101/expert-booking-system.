import { useState, useCallback } from 'react';
import { fetchBookingsByEmail, createBooking, updateBookingStatus } from '../api/bookings';

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchByEmail = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchBookingsByEmail(email);
      setBookings(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const patchStatus = useCallback(async (id, status) => {
    try {
      const res = await updateBookingStatus(id, status);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: res.data.status } : b))
      );
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return { bookings, loading, error, searchByEmail, patchStatus };
};

export const useCreateBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [booking, setBooking] = useState(null);

  const submit = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await createBooking(data);
      setBooking(res.data);
      setSuccess(true);
    } catch (err) {
      setError({ message: err.message, status: err.status });
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, success, booking, submit };
};
