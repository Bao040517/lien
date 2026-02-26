import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import SellerLayout from './layouts/SellerLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import SellerDashboard from './pages/Seller/SellerDashboard';
import AddProduct from './pages/Seller/AddProduct';
import SellerProducts from './pages/Seller/SellerProducts';
import SellerProductAnalytics from './pages/Seller/SellerProductAnalytics';

import SellerVouchers from './pages/Seller/SellerVouchers';
import SellerNotifications from './pages/Seller/SellerNotifications';
import EditProduct from './pages/Seller/EditProduct';
import SellerOrders from './pages/Seller/SellerOrders';
import SellerRevenue from './pages/Seller/SellerRevenue';
import SellerSettings from './pages/Seller/SellerSettings';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminSellers from './pages/Admin/AdminSellers';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminVouchers from './pages/Admin/AdminVouchers';
import AdminFlashSales from './pages/Admin/AdminFlashSales';
import AdminSliders from './pages/Admin/AdminSliders';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import SearchResults from './pages/SearchResults';
import CategoryProducts from './pages/CategoryProducts';
import OrderHistory from './pages/OrderHistory';
import ShopProfile from './pages/ShopProfile';
import ChatPage from './pages/ChatPage';
import MyAccount from './pages/MyAccount';
import { useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import PrivateRoute from './components/PrivateRoute';

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

          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="shop/:id" element={<ShopProfile />} />
          <Route path="cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="search" element={<SearchResults />} />
          <Route path="category/:id" element={<CategoryProducts />} />
          <Route path="purchase" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
          <Route path="profile" element={<PrivateRoute><MyAccount /></PrivateRoute>} />
          <Route path="messages" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
        </Route>

        {/* Admin Routes — Dark Sidebar Layout */}
        <Route path="/admin" element={<PrivateRoute requiredRole="ADMIN"><AdminLayout /></PrivateRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="sellers" element={<AdminSellers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="vouchers" element={<AdminVouchers />} />
          <Route path="flash-sales" element={<AdminFlashSales />} />
          <Route path="sliders" element={<AdminSliders />} />
          <Route path="messages" element={<ChatPage />} />
        </Route>

        {/* Seller Routes — Orange Sidebar Layout */}
        <Route path="/seller" element={<PrivateRoute><SellerLayout /></PrivateRoute>}>
          <Route index element={<SellerDashboard />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="product-analytics" element={<SellerProductAnalytics />} />
          <Route path="notifications" element={<SellerNotifications />} />
          <Route path="vouchers" element={<SellerVouchers />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="revenue" element={<SellerRevenue />} />
          <Route path="messages" element={<ChatPage />} />
          <Route path="settings" element={<SellerSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  );
};

export default App;
