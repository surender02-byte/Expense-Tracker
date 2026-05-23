import { Users, CreditCard, Home, Plane, ShoppingCart, Utensils, Music, Dumbbell } from 'lucide-react';

// Map group names to Lucide icons for visual variety
const iconMap = {
  'CSK Cricket Team': <Users className="w-5 h-5" />,
  'Trip to Goa': <Plane className="w-5 h-5" />,
  'House Expenses': <Home className="w-5 h-5" />,
  'Office Lunch': <Utensils className="w-5 h-5" />,
  'Weekend Party': <Music className="w-5 h-5" />,
  'Gym Membership': <Dumbbell className="w-5 h-5" />,
  'Online Shopping': <ShoppingCart className="w-5 h-5" />,
};

/**
 * GroupCard Component
 * Displays a single expense group with name, icon, and summary.
 *
 * Props:
 *  - groupName  {string}  - Name of the group
 *  - summary    {string}  - Short description or summary
 *  - amount     {number}  - Total amount for the group
 *  - onClick    {func}    - Callback when card is clicked
 *  - darkMode   {bool}    - If true, apply dark theme classes
 */
const GroupCard = ({ groupName, summary, amount = 0, onClick, darkMode = false }) => {
  const icon = iconMap[groupName] || <CreditCard className="w-5 h-5" />;

  const theme = {
    card: darkMode ? 'bg-gray-900 border-gray-800 hover:border-blue-700' : 'bg-white border-gray-200 hover:border-blue-300',
    iconBg: darkMode ? 'bg-gray-800 border-gray-700 text-blue-400 group-hover:bg-gray-700' : 'bg-blue-50 border-blue-100 text-blue-600 group-hover:bg-blue-100',
    amountBadge: darkMode ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-gray-100 text-gray-700 border-gray-200',
    title: darkMode ? 'text-gray-100 group-hover:text-blue-400' : 'text-gray-800 group-hover:text-blue-600',
    summary: darkMode ? 'text-gray-400' : 'text-gray-500',
  };

  return (
    <div
      onClick={onClick}
      className={`${theme.card} rounded-xl p-5 hover:shadow-md transition-all duration-300 cursor-pointer group`}
    >
      {/* Icon Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors duration-300 ${theme.iconBg}`}>
          {icon}
        </div>
        {/* Amount badge */}
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${theme.amountBadge}`}>
          ₹{amount.toLocaleString('en-IN')}
        </span>
      </div>

      {/* Group Title */}
      <h3 className={`font-bold text-sm mb-1 transition-colors ${theme.title}`}>
        {groupName}
      </h3>

      {/* Summary Text */}
      <p className={`text-xs leading-relaxed line-clamp-2 font-medium ${theme.summary}`}>
        {summary}
      </p>

      {/* Bottom accent line on hover */}
      <div className="mt-4 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full group-hover:w-full transition-all duration-500" />
    </div>
  );
};

export default GroupCard;