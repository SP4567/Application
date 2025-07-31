import React, { useEffect, useState } from 'react';
import './App.css';

function ProductList({ onSelectProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch products');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loader">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list">
      <h2>Product List</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id} onClick={() => onSelectProduct(product.id)} className="product-item">
            <strong>{product.name}</strong> <span className="brand">({product.brand})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductDetail({ productId, onBack }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch product details');
        setLoading(false);
      });
  }, [productId]);

  if (loading) return <div className="loader">Loading product details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found.</div>;

  return (
    <div className="product-detail">
      <button className="back-btn" onClick={onBack}>&larr; Back to List</button>
      <h2>{product.name}</h2>
      <p><strong>Brand:</strong> {product.brand}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Department:</strong> {product.department}</p>
      <p><strong>Price:</strong> ${product.retail_price}</p>
      <p><strong>Cost:</strong> ${product.cost}</p>
      <p><strong>SKU:</strong> {product.sku}</p>
      <p><strong>Distribution Center ID:</strong> {product.distribution_center_id}</p>
    </div>
  );
}

function App() {
  const [selectedProductId, setSelectedProductId] = useState(null);

  return (
    <div className="container">
      <nav className="navbar">
        <h1>E-commerce Products</h1>
      </nav>
      <main>
        {selectedProductId ? (
          <ProductDetail productId={selectedProductId} onBack={() => setSelectedProductId(null)} />
        ) : (
          <ProductList onSelectProduct={setSelectedProductId} />
        )}
      </main>
    </div>
  );
}

export default App;
