import React, { useState } from 'react';
// Import any additional components you might need
import './FilterUI.scss'; // Update with your actual style file

const FilterUI = ({ onFilterChange }) => {
    // State for each filter
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [livingRooms, setLivingRooms] = useState('');

    // Handle filter change
    const handleFilterUpdate = () => {
        onFilterChange({ minPrice, maxPrice, bedrooms, bathrooms, livingRooms });
    };

    return (
        <div className="filter-ui">
            {/* Price Range Inputs */}
            <input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            
            {/* Dropdowns for Bedrooms, Bathrooms, Living Rooms */}
            {/* Example for Bedrooms */}
            <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
                <option value="">Any</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                {/* ... More options ... */}
            </select>

            {/* Similar dropdowns for Bathrooms and Living Rooms */}

            {/* Submit Button */}
            <button onClick={handleFilterUpdate}>Apply Filters</button>
        </div>
    );
};

export default FilterUI;
