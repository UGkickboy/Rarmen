'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import StarRating from '../components/StarRating';

interface RamenShop {
  id: number;
  name: string;
  location: string;
  description?: string;
}

export default function Home() {
  const [criteria, setCriteria] = useState({
    field: 'richness',
    condition: 'greater',
    value: 0
  });
  const [results, setResults] = useState<RamenShop[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCriteria(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleStarChange = (rating: number) => {
    setCriteria(prevState => ({
      ...prevState,
      value: rating
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams(criteria as any).toString();
    const response = await fetch(`http://127.0.0.1:5000/api/ramen/search?${query}`);
    const data = await response.json();
    setResults(data);
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">ラーメン店検索</h1>
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            検索項目:
            <select name="field" value={criteria.field} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="richness">濃度</option>
              <option value="richness_level">こってり度</option>
              <option value="taste_overall">総合的な味の評価</option>
              <option value="ingredients_taste">具の美味しさ</option>
              <option value="service">接客</option>
              <option value="cleanliness">店の清潔さ</option>
              <option value="side_menu">サイドメニュー</option>
            </select>
          </label>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            条件:
            <select name="condition" value={criteria.condition} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="greater">以上</option>
              <option value="less">以下</option>
            </select>
          </label>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            評価:
            <StarRating rating={criteria.value} setRating={handleStarChange} />
          </label>
          <button type="submit" className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            検索
          </button>
        </form>

        <h2 className="text-xl font-bold mt-8 mb-4">検索結果</h2>
        <ul>
          {results.map(shop => (
            <li key={shop.id} className="mb-2">
              <Link href={`/ramen/${shop.id}`} legacyBehavior>
                <a className="text-blue-500 hover:text-blue-700">
                  <h3 className="text-lg font-bold">{shop.name}</h3>
                  <p>場所: {shop.location}</p>
                  <p>説明: {shop.description}</p>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
