import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetch = (url, initialData = null, options = {}) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios({
        url,
        ...options,
      });
      if (response.status >= 200 && response.status < 300) {
          setData(response.data);
          setIsStale(false);
      } else {
        setError(new Error(HTTP error! Status: ${response.status}));
        setData(initialData);
      }
    } catch (err) {
        setError(err);
        setData(initialData);
    } finally {
      setLoading(false);
    }
  }, [url, options, initialData]);

    const refreshData = useCallback(() => {
        setIsStale(true);
    }, []);


  useEffect(() => {
      if (url) {
          fetchData();
      }
  }, [url, fetchData, isStale]);


  return { data, loading, error, refreshData };
};

export default useFetch;