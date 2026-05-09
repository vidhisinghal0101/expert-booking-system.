import { Link } from 'react-router-dom';

const categoryColors = {
  Tech: 'bg-blue-100 text-blue-700',
  Business: 'bg-purple-100 text-purple-700',
  Health: 'bg-green-100 text-green-700',
  Finance: 'bg-yellow-100 text-yellow-700',
  Legal: 'bg-red-100 text-red-700',
  Design: 'bg-pink-100 text-pink-700',
};

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};

const ExpertCard = ({ expert }) => {
  const colorClass = categoryColors[expert.category] || 'bg-gray-100 text-gray-700';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={expert.avatar}
          alt={expert.name}
          className="w-16 h-16 rounded-full object-cover bg-gray-100 border border-gray-200"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=6366f1&color=fff`;
          }}
        />
        <div>
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">{expert.name}</h3>
          <p className="text-sm text-gray-500">{expert.experience} yrs experience</p>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{expert.bio}</p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colorClass}`}>
            {expert.category}
          </span>
        </div>
        <StarRating rating={expert.rating} />
      </div>

      <Link
        to={`/experts/${expert._id}`}
        className="mt-4 block text-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
      >
        View Profile
      </Link>
    </div>
  );
};

export default ExpertCard;
