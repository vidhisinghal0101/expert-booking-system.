const SlotPicker = ({ slots, selectedDate, selectedTime, onSelect }) => {
  // Group slots by date
  const grouped = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <div key={date}>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {formatDate(date)}
          </h4>
          <div className="flex flex-wrap gap-2">
            {grouped[date].map((slot) => {
              const isSelected = selectedDate === slot.date && selectedTime === slot.time;
              const isBooked = slot.isBooked;

              return (
                <button
                  key={`${slot.date}-${slot.time}`}
                  disabled={isBooked}
                  onClick={() => !isBooked && onSelect(slot.date, slot.time)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium border transition-all
                    ${isBooked
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                      : isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-400 hover:text-indigo-600 cursor-pointer'
                    }
                  `}
                >
                  {slot.time}
                  {isBooked && <span className="ml-1 text-xs">(Booked)</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SlotPicker;
