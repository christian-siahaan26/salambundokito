import { getStatusColor, getStatusText } from "../../utils/helpers";

const Badge = ({ status, type = "delivery", className = "" }) => {
  const colorClass = getStatusColor(status, type);
  const text = getStatusText(status, type);

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colorClass} ${className}`}
    >
      {text}
    </span>
  );
};

export default Badge;
