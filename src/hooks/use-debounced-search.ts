import { useEffect, useState } from 'react';

export function useDebouncedSearch<T>(
  items: T[],
  query: string,
  filterFn: (item: T, query: string) => boolean,
  delay = 300
) {
  const [filteredItems, setFilteredItems] = useState(items);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(handler);
  }, [query, delay]);

  useEffect(() => {
    if (!debouncedQuery) {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item) => filterFn(item, debouncedQuery)));
    }
  }, [debouncedQuery, items, filterFn]);

  return filteredItems;
}
