// components/SearchBar.js
import { useState } from 'react';
import styles from 'src/styles/SearchBar.module.css';

const SearchBar = ({ onSearch }) => {
    const [tag, setTag] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(tag);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.searchForm}>
            <input 
                type="text" 
                value={tag} 
                onChange={(e) => setTag(e.target.value)} 
                placeholder="Search by tag..." 
                className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton} style={{ backgroundColor: '#EF454A' }}>Search</button>
        </form>
    );
};

export default SearchBar;