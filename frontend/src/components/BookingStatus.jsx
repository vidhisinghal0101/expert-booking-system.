const statusConfig = {
  Pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
  Confirmed: {
    label: 'Confirmed',
    className: 'bg-green-100 text-green-700 border-green-200',
  },
  Completed: {
    label: 'Completed',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
};

const BookingStatus = ({ status }) => {
  const config = statusConfig[status] || statusConfig.Pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
};

export default BookingStatus;
