import React, { useEffect, useState, useRef } from 'react';
import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import './countryList.css'

const COUNTRIES_QUERY = gql`
  query Countries {
    countries {
      name
      code
    }
  }
`;

const colorSet = ['#00c8ff'];

const CountryList = () => {
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loadCountries, { data }] = useLazyQuery(COUNTRIES_QUERY);
  const listRef = useRef(null);

  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  useEffect(() => {
    if (data) {
      let filteredItems = data.countries;

      if (search) {
        filteredItems = filteredItems.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );

        if (filteredItems.length > 0) {
          const scrollToIndex = data.countries.indexOf(filteredItems[0]);
          listRef.current.scrollTo(0, scrollToIndex * 30); 
        }
      }

      const defaultSelectedIndex = Math.min(9, filteredItems.length - 1);
      setSelectedItem(filteredItems[defaultSelectedIndex]);
    }
  }, [data, search]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className='page'>
      <input
      className='field'
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul ref={listRef} >
        {data?.countries.map((item, index) => (
          <li
            key={index}
            onClick={() => handleItemClick(item)}
            style={{
              backgroundColor:
                selectedItem === item ? colorSet[index % colorSet.length] : 'white',
            }}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountryList;
