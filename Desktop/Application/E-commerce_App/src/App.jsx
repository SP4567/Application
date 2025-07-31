import React, { useEffect, useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate
} from 'react-router-dom';

function ProductList({ departmentId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let url = 'http://localhost:3001/products';
    if (departmentId) {
      url = `http://localhost:3001/departments/${departmentId}/products`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch products');
        setLoading(false);
      });
  }, [departmentId]);

  if (loading) return <div className="loader">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list">
      <h2>Product List</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id} onClick={() => navigate(`/products/${product.id}`)} className="product-item">
            <strong>{product.name}</strong> <span className="brand">({product.brand})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch product details');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loader">Loading product details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found.</div>;

  return (
    <div className="product-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>&larr; Back</button>
      <h2>{product.name}</h2>
      <p><strong>Brand:</strong> {product.brand}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Department:</strong> {product.department_name || product.department}</p>
      <p><strong>Price:</strong> ${product.retail_price}</p>
      <p><strong>Cost:</strong> ${product.cost}</p>
      <p><strong>SKU:</strong> {product.sku}</p>
      <p><strong>Distribution Center ID:</strong> {product.distribution_center_id}</p>
    </div>
  );
}


function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/departments')
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data.departments);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch departments');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loader">Loading departments...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="department-list">
      <h2>Departments</h2>
      <ul>
        {departments.map((dept) => (
          <li key={dept.id} className="department-item">
            <Link to={`/departments/${dept.id}`}>{dept.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DepartmentPage() {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/departments`)
      .then((res) => res.json())
      .then((data) => {
        const dept = data.departments.find((d) => String(d.id) === String(id));
        setDepartment(dept);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch department');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loader">Loading department...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!department) return <div className="error">Department not found.</div>;

  return (
    <div className="department-page">
      <h2>Department: {department.name}</h2>
      <ProductList departmentId={id} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="container">
        <nav className="navbar">
          <h1><Link to="/">E-commerce Products</Link></h1>
          <Link to="/departments" className="nav-link">Departments</Link>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/departments" element={<DepartmentList />} />
            <Route path="/departments/:id" element={<DepartmentPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
