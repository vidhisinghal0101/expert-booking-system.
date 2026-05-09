import { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useCreateBooking } from '../hooks/useBookings';

const validate = (form) => {
  const errors = {};
  if (!form.userName.trim()) errors.userName = 'Name is required';
  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Valid email address is required';
  }
  if (!form.phone || !/^\d{10}$/.test(form.phone)) {
    errors.phone = 'Phone must be exactly 10 digits';
  }
  return errors;
};

const BookingForm = () => {
  const { id: expertId } = useParams();
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date') || '';
  const timeSlot = searchParams.get('timeSlot') || '';

  const [form, setForm] = useState({
    userName: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const { loading, error, success, booking, submit } = useCreateBooking();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !timeSlot) {
      setFieldErrors({ form: 'Please select a valid slot before submitting.' });
      return;
    }
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    submit({ expertId, date, timeSlot, ...form });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  if (success && booking) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-10">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-6">
            Your session with <strong>{booking.expertName}</strong> on{' '}
            <strong>{formatDate(booking.date)}</strong> at <strong>{booking.timeSlot}</strong> has been booked.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-left text-sm text-gray-600 mb-6 space-y-1">
            <p><span className="font-medium">Name:</span> {booking.userName}</p>
            <p><span className="font-medium">Email:</span> {booking.email}</p>
            <p><span className="font-medium">Status:</span> <span className="text-yellow-600 font-medium">Pending</span></p>
          </div>
          <Link
            to="/my-bookings"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold text-sm"
          >
            View My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Book Your Session</h1>
        <p className="text-gray-500 text-sm">Fill in your details to confirm the booking.</p>
      </div>

      {/* Slot summary */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
        <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-1">Selected Slot</p>
        <p className="font-semibold text-indigo-900">
          {date && timeSlot ? `${formatDate(date)} at ${timeSlot}` : 'No slot selected. Go back and choose a slot.'}
        </p>
      </div>

      {/* 409 error */}
      {error && error.status === 409 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <span className="text-red-500 text-lg">⚠️</span>
          <div>
            <p className="font-semibold text-red-700 text-sm">Slot No Longer Available</p>
            <p className="text-red-600 text-sm mt-0.5">This slot was just booked by someone else. Please go back and choose another slot.</p>
          </div>
        </div>
      )}

      {/* General error */}
      {error && error.status !== 409 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700 text-sm font-medium">{error.message}</p>
        </div>
      )}

      {fieldErrors.form && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700 text-sm font-medium">{fieldErrors.form}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            placeholder="John Doe"
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              fieldErrors.userName ? 'border-red-400 bg-red-50' : 'border-gray-200'
            }`}
          />
          {fieldErrors.userName && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.userName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'
            }`}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="10-digit number"
            maxLength={10}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              fieldErrors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'
            }`}
          />
          {fieldErrors.phone && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="What would you like to discuss?"
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!date || !timeSlot || loading}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Confirming...
            </>
          ) : (
            'Confirm Booking'
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
