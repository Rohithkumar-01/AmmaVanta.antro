import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, useNavigate, Link, Navigate, useLocation } from 'react-router-dom';
import './App.css';

// ======================== Mock API & Database =========================
// Simulating a real backend API with local storage and promises
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

const apiClient = {
  sendOtp: async (phone) => {
    const res = await fetch(`${API_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Error sending OTP');

    // For local testing without real SMS, alert the OTP so we can test the UI flow
    if (data.mockOtp) {
      alert(`[Backend SMS Mock] Your OTP for ${phone} is: ${data.mockOtp}`);
    }
    return data;
  },

  verifyOtp: async (phone, otp) => {
    const res = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Invalid OTP');
    return data;
  },

  registerUser: async (userData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Registration failed');
    return data;
  },

  loginUser: async (username, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Login failed');
    return data;
  },

  getMenu: async () => {
    const res = await fetch(`${API_URL}/menu`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch menu');
    return data.menuData;
  },

  addMenuItem: async (itemData) => {
    const isFormData = itemData instanceof FormData;
    const res = await fetch(`${API_URL}/menu`, {
      method: 'POST',
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      body: isFormData ? itemData : JSON.stringify(itemData)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to add item');
    return data.item;
  },

  updateMenuItem: async (id, price) => {
    const res = await fetch(`${API_URL}/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to update item');
    return data.item;
  },

  deleteMenuItem: async (id) => {
    const res = await fetch(`${API_URL}/menu/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to delete item');
    return data;
  }
};

// ======================== Auth Context =========================
const AuthContext = createContext(null);

function useAuth() {
  return useContext(AuthContext);
}

// Initial Mock Data Data Arrays
const initialData = {
  tiffins: [
    { id: 't1', name: 'Masala Dosa', price: 60, rating: 4.8, img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=400&q=80' },
    { id: 't2', name: 'Idli Sambar', price: 40, rating: 4.6, img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=400&q=80' },
    { id: 't3', name: 'Vada', price: 35, rating: 4.5, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80' },
    { id: 't4', name: 'Puri Bhaji', price: 50, rating: 4.4, img: 'https://images.unsplash.com/photo-1626200419109-31f8ae7480a4?auto=format&fit=crop&w=400&q=80' },
    { id: 't5', name: 'Upma', price: 35, rating: 4.2, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80' },
    { id: 't6', name: 'Uttapam', price: 55, rating: 4.7, img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=400&q=80' },
    { id: 't7', name: 'Poha', price: 30, rating: 4.3, img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80' },
  ],
  meals: [
    { id: 'm1', name: 'South Indian Thali', price: 150, rating: 4.9, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80' },
    { id: 'm2', name: 'North Indian Thali', price: 180, rating: 4.8, img: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=400&q=80' },
    { id: 'm3', name: 'Veg Biryani', price: 120, rating: 4.6, img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80' },
    { id: 'm4', name: 'Chicken Biryani', price: 220, rating: 4.9, img: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=400&q=80' },
    { id: 'm5', name: 'Paneer Butter Masala', price: 160, rating: 4.7, img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&w=400&q=80' },
    { id: 'm6', name: 'Mutton Curry', price: 280, rating: 4.8, img: 'https://images.unsplash.com/photo-1565557613262-b91c784ac5ff?auto=format&fit=crop&w=400&q=80' },
    { id: 'm7', name: 'Fish Curry Meal', price: 250, rating: 4.6, img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=400&q=80' },
  ],
  starters: [
    { id: 's1', name: 'Paneer Tikka', price: 180, rating: 4.8, img: 'https://images.unsplash.com/photo-1599487405705-8eb0c50add98?auto=format&fit=crop&w=400&q=80' },
    { id: 's2', name: 'Chicken 65', price: 200, rating: 4.7, img: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=400&q=80' },
    { id: 's3', name: 'Chilli Prawns', price: 280, rating: 4.6, img: 'https://images.unsplash.com/photo-1565557613262-b91c784ac5ff?auto=format&fit=crop&w=400&q=80' },
    { id: 's4', name: 'Veg Manchurian', price: 140, rating: 4.5, img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80' },
    { id: 's5', name: 'Gobi 65', price: 130, rating: 4.4, img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80' },
    { id: 's6', name: 'Mutton Kebabs', price: 300, rating: 4.9, img: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=400&q=80' },
    { id: 's7', name: 'Spring Rolls', price: 120, rating: 4.3, img: 'https://images.unsplash.com/photo-1542382156909-924083701bea?auto=format&fit=crop&w=400&q=80' },
  ],
  sweetDrinks: [
    { id: 'd1', name: 'Mango Lassi', price: 80, rating: 4.8, img: 'https://images.unsplash.com/photo-1572490122747-3968b75f5b5b?auto=format&fit=crop&w=400&q=80' },
    { id: 'd2', name: 'Gulab Jamun', price: 60, rating: 4.9, img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=400&q=80' },
    { id: 'd3', name: 'Rasmalai', price: 90, rating: 4.8, img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=400&q=80' },
    { id: 'd4', name: 'Cold Coffee', price: 110, rating: 4.6, img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80' },
    { id: 'd5', name: 'Lemon Soda', price: 50, rating: 4.5, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80' },
    { id: 'd6', name: 'Ice Cream Sundae', price: 140, rating: 4.7, img: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?auto=format&fit=crop&w=400&q=80' },
    { id: 'd7', name: 'Virgin Mojito', price: 120, rating: 4.6, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80' },
  ]
};

// ======================== Components =========================

function Card({ item, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleOrder = () => {
    const qty = parseInt(quantity, 10);
    if (!quantity || isNaN(qty)) {
      setError("Please enter a valid number");
      setSuccess(false);
    } else if (qty < 1) {
      setError("Quantity must be at least 1");
      setSuccess(false);
    } else if (qty > 10) {
      setError("Max 10 items allowed per order");
      setSuccess(false);
    } else {
      setError("");
      setSuccess(true);
      if (onAddToCart) onAddToCart(item, qty);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="card">
      <div className="image-container">
        <img src={item.img} alt={item.name} />
        <span className="rating">⭐ {item.rating}</span>
      </div>
      <div className="card-info">
        <div className="card-header">
          <h3>{item.name}</h3>
          <span className="veg-badge">🌱 Pure Veg</span>
        </div>
        <p className="card-desc">Authentic Indian flavors prepared with rich spices and fresh ingredients.</p>

        <div className="price-row">
          <p className="price">₹{item.price}</p>
        </div>

        <div className="order-section">
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              setError("");
              setSuccess(false);
            }}
            placeholder="Qty"
            className={error ? 'input-error' : ''}
          />
          <button onClick={handleOrder}>Add</button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Added to cart!</div>}
      </div>
    </div>
  );
}

function Section({ title, items, onAddToCart }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="menu-section">
      <h2 className="section-title">{title}</h2>
      <div className="items-row">
        {items.map(item => (
          <Card key={item.id} item={item} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  );
}

function AdminCard({ item, category, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newPrice, setNewPrice] = useState(item.price);

  const handleUpdate = () => {
    if (newPrice && !isNaN(Number(newPrice)) && Number(newPrice) > 0) {
      onUpdate(item.id, category, Number(newPrice));
      setIsEditing(false);
    }
  };

  return (
    <div className="card admin-item-card">
      <div className="image-container">
        <img src={item.img} alt={item.name} />
        <span className="rating">⭐ {item.rating}</span>
      </div>
      <div className="card-info">
        <div className="card-header">
          <h3>{item.name}</h3>
          <span className="veg-badge">🌱 Pure Veg</span>
        </div>
        <p className="card-desc">Authentic Indian flavors prepared with rich spices and fresh ingredients.</p>

        <div className="price-row">
          {isEditing ? (
            <div className="edit-price-section" style={{ display: 'flex', gap: '5px', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold' }}>₹</span>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Price"
                style={{ width: '70px', padding: '0.2rem' }}
              />
              <button onClick={handleUpdate} className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Save</button>
              <button onClick={() => setIsEditing(false)} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>X</button>
            </div>
          ) : (
            <p className="price">₹{item.price}</p>
          )}
        </div>

        {!isEditing && (
          <div className="admin-card-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button onClick={() => setIsEditing(true)} className="btn btn-outline" style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem' }}>Edit Price</button>
            <button onClick={() => onDelete(item.id, category)} className="btn btn-danger" style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ======================== Protected Routes =========================

function Cart({ cartItems }) {
  const navigate = useNavigate();
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const gst = totalPrice * 0.05;
  const grandTotal = totalPrice + gst;

  if (cartItems.length === 0) {
    return (
      <div className="cart-widget empty">
        <h3>Your Order</h3>
        <div className="empty-cart-icon">🍽️</div>
        <p>Your plate is empty. Add some delicious items!</p>
      </div>
    );
  }

  return (
    <div className="cart-widget">
      <h3>Your Items ({totalQuantity})</h3>
      <div className="cart-items">
        {cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <div className="cart-item-info">
              <span className="cart-item-name">{item.name}</span>
              <span className="cart-item-price">₹{item.price} x {item.quantity}</span>
            </div>
            <div className="cart-item-qty-badge">₹{item.price * item.quantity}</div>
          </div>
        ))}
      </div>

      <div className="receipt-slip-container">
        <div className="receipt-slip">
          <div className="receipt-header">
            <h4>AmmaVanta</h4>
            <p>Order Receipt</p>
            <div className="dashed-line"></div>
          </div>

          <div className="receipt-body">
            {cartItems.map((item, idx) => (
              <div key={idx} className="receipt-row">
                <span className="receipt-item-name">{item.quantity}x {item.name}</span>
                <span className="receipt-item-price">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="dashed-line"></div>

          <div className="receipt-footer">
            <div className="receipt-row">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="receipt-row">
              <span>GST (5%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="dashed-line"></div>
            <div className="receipt-row receipt-grand-total">
              <span>Grand Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
            <div className="receipt-thank-you-section">
              <p className="receipt-thank-you">Thank you, visit again!</p>
              <p className="receipt-contact">For any suggestions:<br />rohithkumarchitluru@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      <button className="btn btn-primary full-width mt-4" onClick={() => navigate('/checkout', { state: { cartItems, totalQuantity, totalPrice, gst, grandTotal } })}>
        Place Order • ₹{grandTotal.toFixed(2)}
      </button>
    </div>
  );
}

function CheckoutBill() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const { cartItems, totalQuantity, totalPrice, gst, grandTotal } = state;

  if (!cartItems || cartItems.length === 0) {
    return <Navigate to="/" replace />;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="checkout-page page-fade-in">
      <div className="checkout-container">
        <header className="checkout-header no-print">
          <h2>Order Successfully Placed!</h2>
          <p>Thank you for choosing AmmaVanta. Here is your official bill.</p>
        </header>

        <div className="receipt-slip-container print-area">
          <div className="receipt-slip large-receipt">
            <div className="receipt-header">
              <h4>AmmaVanta</h4>
              <p>Official Order Bill</p>
              <p>{new Date().toLocaleString()}</p>
              <div className="dashed-line"></div>
            </div>

            <div className="receipt-body">
              {cartItems.map((item, idx) => (
                <div key={idx} className="receipt-row">
                  <span className="receipt-item-name">{item.quantity}x {item.name}</span>
                  <span className="receipt-item-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="dashed-line"></div>

            <div className="receipt-footer">
              <div className="receipt-row">
                <span>Total Items</span>
                <span>{totalQuantity}</span>
              </div>
              <div className="receipt-row">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="receipt-row">
                <span>GST (5%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="dashed-line"></div>
              <div className="receipt-row receipt-grand-total">
                <span>Grand Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
              <div className="receipt-thank-you-section">
                <p className="receipt-thank-you">Thank you, visit again!</p>
                <p className="receipt-contact">For any suggestions:<br />rohithkumarchitluru@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="checkout-actions no-print">
          <button className="btn btn-primary" onClick={handlePrint}>Download / Print Bill</button>
          <button className="btn btn-outline" onClick={() => navigate('/')}>Return to Menu</button>
        </div>
      </div>
    </div>
  );
}

// Require any logged in user
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Require admin role
function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}


// ======================== Pages =========================

function Home({ menuData, cartItems, onAddToCart }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('active_user');
    navigate('/login');
  };

  return (
    <div className="page-fade-in">
      <header className="hero-header">
        <h1 className="main-brand-title">AmmaVanta</h1>
        <p>Authentic & Delicious Pure Veg Cuisine</p>

        {user && (
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Welcome, {user.name || user.username}</span>
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Logout</button>
            {user.role === 'admin' && (
              <Link to="/admin" className="btn btn-danger" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Admin Dashboard</Link>
            )}
          </div>
        )}
      </header>

      {/* Floating Cart Button */}
      {cartItems.length > 0 && (
        <div style={{ position: 'fixed', bottom: '2.5rem', right: '2.5rem', zIndex: 1000 }}>
          <button
            className="btn btn-primary"
            style={{ padding: '1.2rem 2.5rem', fontSize: '1.2rem', borderRadius: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.6)', border: '2px solid rgba(245, 158, 11, 0.4)' }}
            onClick={() => navigate('/cart')}
          >
            🛒 View Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
          </button>
        </div>
      )}

      <div className="home-layout">
        <main className="main-content">
          <Section title="Breakfast & Tiffins" items={menuData.tiffins} onAddToCart={onAddToCart} />
          <Section title="Hearty Meals" items={menuData.meals} onAddToCart={onAddToCart} />
          <Section title="Appetizing Starters" items={menuData.starters} onAddToCart={onAddToCart} />
          <Section title="Cool Drinks & Sweets" items={menuData.sweetDrinks} onAddToCart={onAddToCart} />
        </main>
      </div>

      <footer className="footer">
        <p>© 2026 AmmaVanta. All rights reserved.</p>
      </footer>
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    if (formData.username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (formData.password.trim().length < 5) {
      setError("Password must be at least 5 characters.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiClient.loginUser(formData.username, formData.password);
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('active_user', JSON.stringify(response.user));
        if (response.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container page-fade-in">
      <div className="auth-box">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Log in to view the menu</p>
        <div className="admin-hint" style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '1rem', textAlign: 'center', background: 'rgba(255, 183, 3, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
          <strong>Tip:</strong> Login with username <em>admin</em> and password <em>admin</em> to access the Restaurant Admin Dashboard!
        </div>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={formData.username}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
                setError('');
              }}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setError('');
              }}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn btn-primary full-width mt-4" disabled={loading}>
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
        <p className="auth-switch">Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', username: '', phone: '', password: '', otp: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Phone regex: 10 digits
  const isValidPhone = (phone) => /^\d{10}$/.test(phone);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.username.trim() || !formData.phone.trim() || !formData.password.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    if (formData.name.trim().length < 3) {
      setError("Full Name must be at least 3 characters long.");
      return;
    }

    if (formData.username.trim().length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }

    if (formData.password.trim().length < 6) {
      setError("Password must be at least 6 characters for strong security.");
      return;
    }

    if (!isValidPhone(formData.phone.trim())) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      await apiClient.sendOtp(formData.phone);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.otp || formData.otp.length !== 4) {
      setError("Please enter the 4-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      // 1. Verify OTP
      await apiClient.verifyOtp(formData.phone, formData.otp);

      // 2. Register User
      await apiClient.registerUser({
        name: formData.name,
        username: formData.username,
        phone: formData.phone,
        password: formData.password
      });

      alert("Registration Successful! You can now login.");
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container page-fade-in">
      <div className="auth-box">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join us for delicious meals</p>

        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn btn-primary full-width mt-4" disabled={loading}>
              {loading ? "Sending OTP..." : "Continue & Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="input-group">
              <label>Enter OTP sent to {formData.phone}</label>
              <input
                type="text"
                placeholder="4-digit OTP"
                maxLength={4}
                value={formData.otp}
                onChange={(e) => {
                  setFormData({ ...formData, otp: e.target.value });
                  setError('');
                }}
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn btn-primary full-width mt-4" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>
            <button
              type="button"
              className="btn btn-outline full-width mt-2"
              onClick={() => {
                setStep(1);
                setFormData({ ...formData, otp: '' });
                setError('');
              }}
              disabled={loading}
            >
              Back
            </button>
          </form>
        )}

        {step === 1 && <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>}
      </div>
    </div>
  );
}

function AdminPanel({ menuData, setMenuData }) {
  const [category, setCategory] = useState("tiffins");
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    rating: '5.0',
    img: '',
    imgFile: null
  });
  const [message, setMessage] = useState('');

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim() || !newItem.price || (!newItem.img.trim() && !newItem.imgFile)) {
      setMessage("Please fill all details (Name, Price, Image URL or File)");
      return;
    }

    if (newItem.name.trim().length < 3) {
      setMessage("Item name must be at least 3 characters");
      return;
    }

    const price = Number(newItem.price);
    if (isNaN(price) || price <= 0 || price > 5000) {
      setMessage("Please enter a valid price between ₹1 and ₹5000");
      return;
    }

    const rating = Number(newItem.rating);
    if (isNaN(rating) || rating < 1.0 || rating > 5.0) {
      setMessage("Rating must be a number from 1.0 to 5.0");
      return;
    }

    if (!newItem.img.startsWith('http') && !newItem.imgFile) {
      setMessage("Please enter a valid image URL or upload an image file from your computer");
      return;
    }

    const formData = new FormData();
    formData.append('category', category);
    formData.append('name', newItem.name.trim());
    formData.append('price', price);
    formData.append('rating', rating);

    if (newItem.imgFile) {
      formData.append('imageFile', newItem.imgFile);
      formData.append('img', 'uploaded-placeholder'); // Just pass the check
    } else {
      formData.append('img', newItem.img.trim());
    }

    try {
      const addedItem = await apiClient.addMenuItem(formData);

      setMenuData(prev => ({
        ...prev,
        [category]: [...prev[category], addedItem]
      }));

      setMessage("Item added successfully to database!");
      setNewItem({ name: '', price: '', rating: '5.0', img: '', imgFile: null });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleUpdatePrice = async (itemId, categoryName, newPrice) => {
    try {
      await apiClient.updateMenuItem(itemId, newPrice);
      setMenuData(prev => ({
        ...prev,
        [categoryName]: prev[categoryName].map(item => item.id === itemId ? { ...item, price: newPrice } : item)
      }));
      setMessage("Price updated successfully!");
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`Error updating price: ${err.message}`);
    }
  };

  const handleDeleteItem = async (itemId, categoryName) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await apiClient.deleteMenuItem(itemId);
      setMenuData(prev => ({
        ...prev,
        [categoryName]: prev[categoryName].filter(item => item.id !== itemId)
      }));
      setMessage("Item deleted successfully!");
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`Error deleting item: ${err.message}`);
    }
  };

  return (
    <div className="admin-container page-fade-in">
      <header className="hero-header" style={{ padding: '2rem 1rem', marginBottom: '0' }}>
        <h1 className="main-brand-title" style={{ fontSize: '2.5rem' }}>AmmaVanta Admin</h1>
        <p>Pure Veg Restaurant Dashboard</p>
      </header>

      <header className="admin-header">
        <h1>Control Panel</h1>
        <div className="admin-actions">
          <Link to="/" className="btn btn-outline">View Site</Link>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-card">
          <h2>Add New Menu Item</h2>

          <form onSubmit={handleAddItem} className="admin-form">
            <div className="input-row">
              <div className="input-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="tiffins">Tiffins</option>
                  <option value="meals">Meals</option>
                  <option value="starters">Starters</option>
                  <option value="sweetDrinks">Sweets & Drinks</option>
                </select>
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Item Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Garlic Naan"
                />
              </div>
              <div className="input-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  placeholder="e.g. 45"
                />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Rating (Default 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  max="5.0"
                  min="1.0"
                  value={newItem.rating}
                  onChange={(e) => setNewItem({ ...newItem, rating: e.target.value })}
                  placeholder="4.5"
                />
              </div>
              <div className="input-group flex-2">
                <label>Image Upload or URL</label>
                <div style={{ display: 'flex', gap: '0.8rem', flexDirection: 'column' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewItem({ ...newItem, imgFile: e.target.files[0], img: '' })}
                    style={{ padding: '0.5rem' }}
                  />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center' }}>- OR -</span>
                  <input
                    type="text"
                    value={newItem.img}
                    onChange={(e) => setNewItem({ ...newItem, img: e.target.value, imgFile: null })}
                    placeholder="Paste an https:// image URL..."
                    disabled={!!newItem.imgFile}
                  />
                </div>
              </div>
            </div>

            {message && <div className={message.includes('success') ? 'success-message large' : 'error-message large'}>{message}</div>}

            <button type="submit" className="btn btn-primary mt-4">Add Item to Menu</button>
          </form>
        </div>

        <div className="admin-preview">
          <h3>Live Menu Preview - {category.toUpperCase()} ({menuData[category].length} items)</h3>
          <div className="items-row preview-row">
            {menuData[category].map(item => (
              <AdminCard
                key={item.id}
                item={item}
                category={category}
                onUpdate={handleUpdatePrice}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ======================== Main App =========================

function CartPage({ cartItems }) {
  const navigate = useNavigate();
  return (
    <div className="page-fade-in" style={{ padding: '3rem 1rem', background: 'var(--page-bg)', minHeight: '100vh' }}>
      <header className="hero-header" style={{ padding: '1rem 1rem 3rem 1rem', marginBottom: '1rem' }}>
        <h1 className="main-brand-title" style={{ fontSize: '3rem' }}>Your Basket</h1>
        <button className="btn btn-outline" onClick={() => navigate('/')} style={{ marginTop: '1.5rem' }}>← Back to Menu</button>
      </header>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Cart cartItems={cartItems} />
      </div>
    </div>
  );
}

function App() {
  const [menuData, setMenuData] = useState(initialData);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('active_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (item, quantity) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...item, quantity }];
    });
  };

  // Fetch menu from database on load
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const fetchedMenu = await apiClient.getMenu();
        if (Object.keys(fetchedMenu).length > 0) {
          // Replace initial data if database returns categories
          setMenuData(fetchedMenu);
        }
      } catch (err) {
        console.error("Using fallback local data due to error: ", err);
      }
    };
    fetchMenu();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home menuData={menuData} cartItems={cartItems} onAddToCart={handleAddToCart} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage cartItems={cartItems} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutBill />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel menuData={menuData} setMenuData={setMenuData} />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
