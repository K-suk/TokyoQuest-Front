// components/SearchBar.js
import { useState } from 'react';
import styles from 'src/styles/SearchBar.module.css';

function SearchBar({ onSearch }) {
  const [tag, setTag] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSearch(tag);
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Search by tag..."
          className={styles.searchInput}
          disabled={loading}
        />
        <button type="submit" className={styles.searchButton} style={{ backgroundColor: '#EF454A' }} disabled={loading}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
