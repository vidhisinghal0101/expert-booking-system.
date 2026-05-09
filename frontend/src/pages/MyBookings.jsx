import { useState } from 'react';
import { useBookings } from '../hooks/useBookings';
import BookingStatus from '../components/BookingStatus';
import { InlineLoader } from '../components/Loader';

const MyBookings = () => {
  const [emailInput, setEmailInput] = useState('');
  const [searchedEmail, setSearchedEmail] = useState('');
  const { bookings, loading, error, searchByEmail, patchStatus } = useBookings();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSearchedEmail(emailInput.trim());
    searchByEmail(emailInput.trim());
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-500">Enter your email to view all your booked sessions.</p>
      </div>

      {/* Email search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          type="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder="Enter your email address"
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-60"
        >
          Search
        </button>
      </form>

      {/* Results */}
      {loading && <InlineLoader />}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && searchedEmail && bookings.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No bookings found</h3>
          <p className="text-gray-500 text-sm">No sessions found for <strong>{searchedEmail}</strong>.</p>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 mb-4">
            Found <strong>{bookings.length}</strong> booking{bookings.length !== 1 ? 's' : ''} for <strong>{searchedEmail}</strong>
          </p>
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{booking.expertName}</h3>
                    <BookingStatus status={booking.status} />
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(booking.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {booking.timeSlot}
                    </span>
                  </div>
                  {booking.notes && (
                    <p className="mt-2 text-sm text-gray-500 italic">"{booking.notes}"</p>
                  )}
                </div>

                {/* Status action buttons (demo) */}
                <div className="flex gap-2 flex-shrink-0">
                  {booking.status === 'Pending' && (
                    <button
                      onClick={() => patchStatus(booking._id, 'Confirmed')}
                      className="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      Confirm
                    </button>
                  )}
                  {booking.status === 'Confirmed' && (
                    <button
                      onClick={() => patchStatus(booking._id, 'Completed')}
                      className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
