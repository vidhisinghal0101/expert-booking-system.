import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExpertById } from '../hooks/useExperts';
import useSocket from '../hooks/useSocket';
import SlotPicker from '../components/SlotPicker';
import { InlineLoader } from '../components/Loader';
import ErrorState from '../components/ErrorState';

const categoryColors = {
  Tech: 'bg-blue-100 text-blue-700',
  Business: 'bg-purple-100 text-purple-700',
  Health: 'bg-green-100 text-green-700',
  Finance: 'bg-yellow-100 text-yellow-700',
  Legal: 'bg-red-100 text-red-700',
  Design: 'bg-pink-100 text-pink-700',
};

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-5 h-5 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    <span className="text-gray-600 ml-1 font-medium">{rating?.toFixed(1)}</span>
  </div>
);

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [liveUpdate, setLiveUpdate] = useState(null);

  const { expert, loading, error, refetch, updateSlot } = useExpertById(id);

  // Real-time socket: update slot when another user books it
  const handleSlotBooked = useCallback((date, timeSlot) => {
    updateSlot(date, timeSlot);
    setLiveUpdate(`Slot ${timeSlot} on ${date} was just booked by someone else.`);
    // Clear the selection if the selected slot was just booked
    if (selectedDate === date && selectedTime === timeSlot) {
      setSelectedDate(null);
      setSelectedTime(null);
    }
    setTimeout(() => setLiveUpdate(null), 5000);
  }, [updateSlot, selectedDate, selectedTime]);

  useSocket(id, handleSlotBooked);

  const handleSlotSelect = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) return;
    navigate(`/book/${id}?date=${encodeURIComponent(selectedDate)}&timeSlot=${encodeURIComponent(selectedTime)}`);
  };

  if (loading) return <InlineLoader />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!expert) return null;

  const colorClass = categoryColors[expert.category] || 'bg-gray-100 text-gray-700';
  const availableCount = expert.availableSlots?.filter((s) => !s.isBooked).length || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <button
        onClick={() => navigate('/experts')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Experts
      </button>

      {/* Live update notification */}
      {liveUpdate && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-3">
          <span className="text-orange-500">🔴</span>
          <p className="text-sm text-orange-700 font-medium">{liveUpdate}</p>
        </div>
      )}

      {/* Expert Profile */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <img
            src={expert.avatar}
            alt={expert.name}
            className="w-24 h-24 rounded-2xl object-cover bg-gray-100 border border-gray-200 flex-shrink-0"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=6366f1&color=fff&size=96`;
            }}
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{expert.name}</h1>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colorClass}`}>
                {expert.category}
              </span>
            </div>
            <StarRating rating={expert.rating} />
            <p className="text-gray-500 text-sm mt-1">{expert.experience} years of experience</p>
            <p className="text-gray-700 mt-4 leading-relaxed">{expert.bio}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {availableCount} slots available
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Next 7 days
          </span>
        </div>
      </div>

      {/* Slot Picker */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Available Time Slots</h2>

        {expert.availableSlots && expert.availableSlots.length > 0 ? (
          <SlotPicker
            slots={expert.availableSlots}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelect={handleSlotSelect}
          />
        ) : (
          <p className="text-gray-500 text-sm">No slots available at this time.</p>
        )}

        {selectedDate && selectedTime && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Selected slot</p>
                <p className="font-semibold text-gray-900">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric'
                  })} at {selectedTime}
                </p>
              </div>
              <button
                onClick={handleBooking}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold text-sm shadow-sm"
              >
                Book This Slot →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertDetail;
