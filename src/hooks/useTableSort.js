import { useEffect, useState } from 'react';

const useTableSort = (initialData, initialSortValue) => {
  const [sortedData, setSortedData] = useState([]);
  const [sortValue, setSortValue] = useState(initialSortValue);

  const sortData = (value) => {
    const sorted = [...initialData].sort((a, b) => {
      if (value === 'First Name') {
        return a.givenName.localeCompare(b.givenName);
      }
      if (value === 'Last Name') {
        return a.familyName.localeCompare(b.familyName);
      }
      if (value === 'Web ID') {
        return a.webId.localeCompare(b.webId);
      }
      return 0;
    });
    setSortedData(sorted);
  };

  useEffect(() => {
    setSortedData([...initialData]);
  }, [initialData]);

  useEffect(() => {
    if (initialData.length > 0) {
      sortData(sortValue, initialData);
    }
  }, [sortValue, initialData]);

  return { sortedData, sortValue, setSortValue };
};

export default useTableSort;
