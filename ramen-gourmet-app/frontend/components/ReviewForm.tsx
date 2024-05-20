import { useState } from 'react';
import StarRating from './StarRating';

interface ReviewFormProps {
  ramenShopId: number;
  onClose: () => void;
}

export default function ReviewForm({ ramenShopId, onClose }: ReviewFormProps) {
  const [richness, setRichness] = useState<number>(0);
  const [richnessLevel, setRichnessLevel] = useState<number>(0);
  const [tasteOverall, setTasteOverall] = useState<number>(0);
  const [ingredientsTaste, setIngredientsTaste] = useState<number>(0);
  const [service, setService] = useState<number>(0);
  const [cleanliness, setCleanliness] = useState<number>(0);
  const [sideMenu, setSideMenu] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const review = { 
      ramen_shop_id: ramenShopId, 
      richness, 
      richness_level: richnessLevel, 
      taste_overall: tasteOverall, 
      ingredients_taste: ingredientsTaste, 
      service, 
      cleanliness, 
      side_menu: sideMenu, 
      comment 
    };
    
    const response = await fetch('http://127.0.0.1:5000/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });

    if (response.ok) {
      onClose();
    } else {
      console.error('Failed to add review');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block text-gray-700 text-sm font-bold mb-2">
        濃度:
        <StarRating rating={richness} setRating={setRichness} />
      </label>
      <label className="block text-gray-700 text-sm font-bold mb-2">
        こってり度:
        <StarRating rating={richnessLevel} setRating={setRichnessLevel} />
      </label>
      <label className="block text-gray-700 text-sm font-bold mb-2">
        総合的な味の評価:
        <StarRating rating={tasteOverall} setRating={setTasteOverall} />
      </label>
      <label className="block text-gray-700 text-sm font-bold mb-2">
        具の美味しさ:
        <StarRating rating={ingredientsTaste} setRating={setIngredientsTaste} />
      </label>
      <label className="block text-gray-700 text-sm font-bold mb-2">
        接客:
        <StarRating rating={service} setRating={setService} />
      </label>
      <label className="block text-gray-700 text-sm font-bold mb-2">
        店の清潔さ:
        <StarRating rating={cleanliness} setRating={setCleanliness} />
      </label>
      <label className="block text-gray-700 text-sm font-bold mb-2">
        サイドメニュー:
        <StarRating rating={sideMenu} setRating={setSideMenu} />
      </label>
      <label className="block text-gray-700 text-sm font-bold mb-2">
        コメント:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </label>
      <button type="submit" className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        提出
      </button>
    </form>
  );
}
