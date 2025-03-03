import { useState, useEffect, useRef, useCallback } from "react";

const fetchProducts = async (skip, limit) => {
  const response = await fetch(
    `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
  );
  const data = await response.json();
  return data.products;
};

export default function InfiniteScroll() {
  const [products, setProducts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);

  const loadMoreProducts = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const newProducts = await fetchProducts(skip, 10);
    setProducts((prev) => [...prev, ...newProducts]);
    setSkip((prevSkip) => prevSkip + 10);
    setLoading(false);
  }, [skip, loading]);

  useEffect(() => {
    loadMoreProducts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreProducts();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMoreProducts]);

  return (
    <div className="container">
      <h1 className="title">Infinite Scroll Products</h1>
      <div className="grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="product-image"
            />
            <h2 className="product-title">{product.title}</h2>
            <p className="product-price">${product.price}</p>
          </div>
        ))}
      </div>
      <div ref={observerRef} className="loading">
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
}
