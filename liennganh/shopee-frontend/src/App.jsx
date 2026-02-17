import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import SellerLayout from './layouts/SellerLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerRegister from './pages/SellerRegister';
import SellerDashboard from './pages/Seller/SellerDashboard';
import AddProduct from './pages/Seller/AddProduct';
import SellerProducts from './pages/Seller/SellerProducts';

import SellerVouchers from './pages/Seller/SellerVouchers';
import SellerNotifications from './pages/Seller/SellerNotifications';
import EditProduct from './pages/Seller/EditProduct';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminSellers from './pages/Admin/AdminSellers';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminVouchers from './pages/Admin/AdminVouchers';
import AdminFlashSales from './pages/Admin/AdminFlashSales';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import SearchResults from './pages/SearchResults';
import CategoryProducts from './pages/CategoryProducts';
import OrderHistory from './pages/OrderHistory';
import ShopProfile from './pages/ShopProfile';
import { useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const App = () => {
  const { loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <CartProvider>
      <Routes>
        {/* User/Buyer Routes — Shopping Navbar */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="register-seller" element={<SellerRegister />} />
          <Route path="register-seller" element={<SellerRegister />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="shop/:id" element={<ShopProfile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="category/:id" element={<CategoryProducts />} />
          <Route path="purchase" element={<OrderHistory />} />
        </Route>

        {/* Admin Routes — Dark Sidebar Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="sellers" element={<AdminSellers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="vouchers" element={<AdminVouchers />} />
          <Route path="flash-sales" element={<AdminFlashSales />} />
        </Route>

        {/* Seller Routes — Orange Sidebar Layout */}
        <Route path="/seller" element={<SellerLayout />}>
          <Route index element={<SellerDashboard />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="notifications" element={<SellerNotifications />} />
          <Route path="vouchers" element={<SellerVouchers />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="orders" element={<SellerDashboard />} />
          <Route path="revenue" element={<SellerDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  );
};

export default App;
