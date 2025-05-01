import { Star, StarBorder, StarHalf } from "./icons";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

export function Rating({
  value,
  max = 5,
  size = "md",
  color = "text-amber-500",
  showValue = false,
  reviewCount,
  className = "",
}: RatingProps) {
  // Calculate the number of full stars
  const fullStars = Math.floor(value);
  
  // Check if there should be a half star
  const hasHalfStar = value - fullStars >= 0.5;
  
  // Calculate remaining empty stars
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);
  
  // Determine icon size based on prop
  const getIconSize = () => {
    switch (size) {
      case "sm": return "w-3 h-3";
      case "lg": return "w-6 h-6";
      default: return "w-5 h-5";
    }
  };
  
  const iconSize = getIconSize();
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={`${iconSize} ${color}`} />
        ))}
        
        {hasHalfStar && (
          <StarHalf className={`${iconSize} ${color}`} />
        )}
        
        {[...Array(emptyStars)].map((_, i) => (
          <StarBorder key={`empty-${i}`} className={`${iconSize} ${color}`} />
        ))}
      </div>
      
      {showValue && (
        <span className="ml-1 font-medium">
          {value.toFixed(1)}
        </span>
      )}
      
      {reviewCount !== undefined && (
        <span className="text-gray-500 ml-1">
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
}
