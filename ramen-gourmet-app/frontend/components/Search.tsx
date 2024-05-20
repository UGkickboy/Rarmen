import { useState } from 'react';

const Search = () => {
  const [criteria, setCriteria] = useState({
    field: 'richness',
    condition: 'greater',
    value: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCriteria(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams(criteria).toString();
    const response = await fetch(`http://127.0.0.1:5000/api/ramen/search?${query}`);
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <h2>ラーメン店検索</h2>
      <form onSubmit={handleSubmit}>
        <label>
          検索項目:
          <select name="field" value={criteria.field} onChange={handleChange}>
            <option value="richness">濃度</option>
            <option value="richness_level">こってり度</option>
            <option value="taste_overall">総合的な味の評価</option>
            <option value="ingredients_taste">具の美味しさ</option>
            <option value="service">接客</option>
            <option value="cleanliness">店内の清潔さ</option>
            <option value="side_menu">サイドメニュー</option>
          </select>
        </label>
        <br />
        <label>
          条件:
          <select name="condition" value={criteria.condition} onChange={handleChange}>
            <option value="greater">以上</option>
            <option value="less">以下</option>
          </select>
        </label>
        <br />
        <label>
          値:
          <input
            type="number"
            name="value"
            value={criteria.value}
            onChange={handleChange}
            step="0.1"
          />
        </label>
        <br />
        <button type="submit">検索</button>
      </form>
    </div>
  );
};

export default Search;
