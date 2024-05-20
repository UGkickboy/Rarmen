import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

export default function StarRating({ rating, setRating }: StarRatingProps) {
  const [hover, setHover] = useState<number>(0);

  return (
    <div className="flex">
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          className={`w-6 h-6 cursor-pointer ${index < (hover || rating) ? 'text-yellow-500' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          onClick={() => setRating(index + 1)}
          onMouseEnter={() => setHover(index + 1)}
          onMouseLeave={() => setHover(0)}
        >
          <path d="M9.049 2.927C9.243 2.295 9.882 2 10.548 2s1.305.295 1.499.927l1.214 3.746a1 1 0 00.949.691h3.952c.619 0 .874.779.419 1.117l-3.2 2.222a1 1 0 00-.364 1.118l1.214 3.746c.194.632-.555 1.155-1.049.81L10.5 13.69a1 1 0 00-1.175 0l-3.2 2.222c-.494.345-1.243-.178-1.049-.81l1.214-3.746a1 1 0 00-.364-1.118L2.68 8.481a1 1 0 01.42-1.117h3.952a1 1 0 00.949-.691l1.213-3.746z" />
        </svg>
      ))}
    </div>
  );
}
