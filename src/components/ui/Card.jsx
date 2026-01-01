const Card = ({ children, className = "", padding = true, shadow = true }) => {
  return (
    <div
      className={`bg-white rounded-lg ${padding ? "p-6" : ""} ${
        shadow ? "shadow-md" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
