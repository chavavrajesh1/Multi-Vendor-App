import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Customer Pages
import Home from "./pages/customer/CustomerHomePage";
import Cart from "./pages/customer/CartPage"; 
import CheckoutPage from "./pages/customer/CheckoutPage"; 
import Orders from "./pages/orders/Orders";
import { CustomerOrderConfirmation } from "./pages/customer/CustomerOrderConfirmation";
import Profile from "./pages/customer/Profile"; // ✅ Profile Import

// Vendor Pages
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorOrdersPage from "./pages/vendor/VendorOrdersPage";
import VendorProductsPage from "./pages/vendor/VendorProductsPage";
import AddProductPage from "./pages/vendor/AddProductPage";
import EditProductPage from "./pages/vendor/EditProductPage"; 
import AddRestaurant from "./pages/vendor/AddRestaurant";
import DeliveryUpdatePage from "./pages/vendor/DeliveryUpdatePage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Approvals from "./pages/admin/AdminApprovals";
import AdminVendorList from "./pages/admin/AdminVendorList";
import VendorDetails from "./pages/admin/AdminVendorDetails";
import AdminAddCategory from "./pages/admin/AdminAddCategory";

// Public Pages
import PublicHome from "./pages/public/PublicHome";

// Layouts & Routing
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import MainLayout from "./components/layout/MainLayout";
import PublicLayout from "./components/layout/PublicLayout";
import VendorLayout from "./components/layout/VendorLayout";
import AdminLayout from "./components/layout/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* 1. PUBLIC ROUTES (లాగిన్ అవసరం లేనివి) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PublicHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* డెలివరీ అప్‌డేట్ లింక్ */}
          <Route path="/delivery-update/:orderId" element={<DeliveryUpdatePage />} />
        </Route>

        {/* 2. PROTECTED ROUTES (లాగిన్ అయిన అందరికీ - MainLayout తో) */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* ✅ Profile Route - ఇక్కడ ఉంచడం వల్ల అందరికీ యాక్సెస్ ఉంటుంది */}
          <Route path="/profile" element={<Profile />} />

          {/* Customer Specific Routes */}
          <Route
            path="/home"
            element={
              <RoleRoute role="customer">
                <Home />
              </RoleRoute>
            }
          />
          
          <Route
            path="/cart"
            element={
              <RoleRoute role="customer">
                <Cart />
              </RoleRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <RoleRoute role="customer">
                <CheckoutPage />
              </RoleRoute>
            }
          />

          <Route
            path="/my-orders"
            element={
              <RoleRoute role="customer">
                <Orders />
              </RoleRoute>
            }
          />

          <Route path="/orders" element={<Navigate to="/my-orders" replace />} />

          <Route
            path="/order-confirmation/:orderId"
            element={
              <RoleRoute role="customer">
                <CustomerOrderConfirmation />
              </RoleRoute>
            }
          />
        </Route>

        {/* 3. VENDOR PROTECTED ROUTES */}
        <Route
          path="/vendor"
          element={
            <ProtectedRoute>
              <RoleRoute role="vendor">
                <VendorLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<VendorDashboard />} />
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="add-restaurant" element={<AddRestaurant />} />
          <Route path="products" element={<VendorProductsPage />} />
          <Route path="add-product" element={<AddProductPage />} />
          <Route path="edit-product/:id" element={<EditProductPage />} /> 
          <Route path="orders" element={<VendorOrdersPage />} />
        </Route>

        {/* 4. ADMIN PROTECTED ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <AdminLayout /> 
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="vendors" element={<AdminVendorList/>}/>
          <Route path="vendor/:id" element={<VendorDetails/>}/>
          <Route path="add-category" element={<AdminAddCategory/>}/>
        </Route>

        {/* 5. 404 - REDIRECT TO HOME */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;