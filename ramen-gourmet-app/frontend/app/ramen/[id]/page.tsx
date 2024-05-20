'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import ReviewForm from '../../../components/ReviewForm';

interface RamenShop {
  id: number;
  name: string;
  location: string;
  description?: string;
}

interface Review {
  id: number;
  ramen_shop_id: number;
  richness: number;
  richness_level: number;
  taste_overall: number;
  ingredients_taste: number;
  service: number;
  cleanliness: number;
  side_menu: number;
  comment: string;
}

interface Averages {
  avg_richness: number;
  avg_richness_level: number;
  avg_taste_overall: number;
  avg_ingredients_taste: number;
  avg_service: number;
  avg_cleanliness: number;
  avg_side_menu: number;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex">
    {Array.from({ length: 5 }, (_, index) => (
      <svg key={index} className={`w-6 h-6 ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927C9.243 2.295 9.882 2 10.548 2s1.305.295 1.499.927l1.214 3.746a1 1 0 00.949.691h3.952c.619 0 .874.779.419 1.117l-3.2 2.222a1 1 0 00-.364 1.118l1.214 3.746c.194.632-.555 1.155-1.049.81L10.5 13.69a1 1 0 00-1.175 0l-3.2 2.222c-.494.345-1.243-.178-1.049-.81l1.214-3.746a1 1 0 00-.364-1.118L2.68 8.481a1 1 0 01.42-1.117h3.952a1 1 0 00.949-.691l1.213-3.746z" />
      </svg>
    ))}
  </div>
);

export default function RamenShopDetail() {
  const params = useParams();
  const { id } = params;
  const [ramenShop, setRamenShop] = useState<RamenShop | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averages, setAverages] = useState<Averages | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:5000/api/ramen/${id}`)
        .then(response => response.json())
        .then(data => setRamenShop(data))
        .catch(error => console.error('Error fetching data:', error));
      
      fetch(`http://127.0.0.1:5000/api/reviews/${id}`)
        .then(response => response.json())
        .then(data => {
          setReviews(data.reviews);
          setAverages(data.averages);
        })
        .catch(error => console.error('Error fetching reviews:', error));
    }
  }, [id]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (!id || !ramenShop) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{ramenShop.name}</h1>
        <p className="mb-2"><strong>場所:</strong> {ramenShop.location}</p>
        {ramenShop.description && <p className="mb-4"><strong>説明:</strong> {ramenShop.description}</p>}
        
        <button onClick={handleOpenModal} className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          レビューする
        </button>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className="bg-white p-6">
                <ReviewForm ramenShopId={ramenShop.id} onClose={handleCloseModal} />
                <button onClick={handleCloseModal} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold mt-8 mb-4">平均点</h2>
        {averages && (
          <div className="mb-4">
            <p>濃度: <StarRating rating={Math.round(averages.avg_richness)} /></p>
            <p>こってり度: <StarRating rating={Math.round(averages.avg_richness_level)} /></p>
            <p>総合的な味の評価: <StarRating rating={Math.round(averages.avg_taste_overall)} /></p>
            <p>具の美味しさ: <StarRating rating={Math.round(averages.avg_ingredients_taste)} /></p>
            <p>接客: <StarRating rating={Math.round(averages.avg_service)} /></p>
            <p>店の清潔さ: <StarRating rating={Math.round(averages.avg_cleanliness)} /></p>
            <p>サイドメニュー: <StarRating rating={Math.round(averages.avg_side_menu)} /></p>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">レビュー</h2>
        <ul className="mb-4">
          {reviews.map(review => (
            <li key={review.id} className="mb-2 p-4 bg-gray-100 rounded shadow-md">
              <p>濃度: <StarRating rating={review.richness} /></p>
              <p>こってり度: <StarRating rating={review.richness_level} /></p>
              <p>総合的な味の評価: <StarRating rating={review.taste_overall} /></p>
              <p>具の美味しさ: <StarRating rating={review.ingredients_taste} /></p>
              <p>接客: <StarRating rating={review.service} /></p>
              <p>店の清潔さ: <StarRating rating={review.cleanliness} /></p>
              <p>サイドメニュー: <StarRating rating={review.side_menu} /></p>
              <p>コメント: {review.comment}</p>
            </li>
          ))}
        </ul>

        <Link href="/" legacyBehavior>
          <a className="text-blue-500 hover:text-blue-700">ホームに戻る</a>
        </Link>
      </div>
    </div>
  );
}
