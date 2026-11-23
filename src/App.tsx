import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import { CartProvider } from "./features/storefront/cart";
// Sign-in stays eager: it is the first screen for every signed-out admin, so
// it should paint without waiting for another chunk. Every other route is
// split into its own chunk (the whole dashboard used to ship as one ~1.5MB
// bundle on the sign-in screen).
import SignInPage from "./pages/auth/SignInPage";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const AnalyticsOverview = lazy(() => import("./pages/analytics/AnalyticsOverview"));
const AdvancedAnalytics = lazy(() => import("./pages/analytics/AdvancedAnalytics"));
const RealTimeAnalytics = lazy(() => import("./pages/analytics/RealTimeAnalytics"));
const BusinessIntelligence = lazy(() => import("./pages/analytics/BusinessIntelligence"));
const ReportBuilder = lazy(() => import("./pages/analytics/ReportBuilder"));

const ProductsPage = lazy(() => import("./pages/commerce/ProductsPage"));
const ProductManagementPage = lazy(() => import("./pages/commerce/ProductManagementPage"));
const ProductPreviewPage = lazy(() => import("./pages/commerce/ProductPreviewPage"));
const OrdersPage = lazy(() => import("./pages/commerce/OrdersPage"));
const InventoryPage = lazy(() => import("./pages/commerce/InventoryPage"));
const PaymentsPage = lazy(() => import("./pages/commerce/PaymentsPage"));
const PaymentsManagementPage = lazy(() => import("./pages/commerce/PaymentsManagementPage"));
const UsersManagementPage = lazy(() => import("./pages/users/UsersManagementPage"));
const CampaignDashboard = lazy(() => import("./pages/campaigns/CampaignDashboard"));
const CampaignsPage = lazy(() => import("./pages/campaigns/CampaignsPage"));
const MetaSetupPage = lazy(() => import("./pages/campaigns/MetaSetupPage"));
const EventTrackingPage = lazy(() => import("./pages/campaigns/EventTrackingPage"));
const GettingStartedPage = lazy(() => import("./pages/campaigns/GettingStartedPage"));
const ContentPage = lazy(() => import("./pages/content/ContentPage"));
const CategoriesPage = lazy(() => import("./pages/content/CategoriesPage"));
const SubCategoriesPage = lazy(() => import("./pages/content/SubCategoriesPage"));
const BannersPage = lazy(() => import("./pages/content/BannersPage"));
const MediaLibraryPage = lazy(() => import("./pages/content/MediaLibraryPage"));
const NotificationsPage = lazy(() => import("./pages/content/NotificationsPage"));
const AuditLogsPage = lazy(() => import("./pages/content/AuditLogsPage"));
const DataManagementPage = lazy(() => import("./pages/system/DataManagementPage"));
const AIAutomationPage = lazy(() => import("./pages/system/AIAutomationPage"));
const PluginsPage = lazy(() => import("./pages/system/PluginsPage"));
const SettingsPage = lazy(() => import("./pages/system/SettingsPage"));
const ReviewsPage = lazy(() => import('./pages/reviews'));
const ReviewsAnalyticsPage = lazy(() => import('./pages/reviews/ReviewsAnalyticsPage'));
const NotFound = lazy(() => import("./pages/NotFound"));
const ShopLayout = lazy(() => import("./pages/shop/ShopLayout"));
const ShopHomePage = lazy(() => import("./pages/shop/ShopHomePage"));
const ShopProductsPage = lazy(() => import("./pages/shop/ShopProductsPage"));
const ShopProductDetailsPage = lazy(() => import("./pages/shop/ShopProductDetailsPage"));
const ShopCartPage = lazy(() => import("./pages/shop/ShopCartPage"));
const ShopCheckoutPage = lazy(() => import("./pages/shop/ShopCheckoutPage"));
const ShopOrderSuccessPage = lazy(() => import("./pages/shop/ShopOrderSuccessPage"));

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <CartProvider>
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="flex min-h-screen items-center justify-center bg-background">
                <div
                  className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary"
                  role="status"
                  aria-label="Loading"
                />
              </div>
            }
          >
          <Routes>
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/products/:id/preview" element={<ProductPreviewPage />} />

            <Route path="/shop" element={<ShopLayout />}>
              <Route index element={<ShopHomePage />} />
              <Route path="products" element={<ShopProductsPage />} />
              <Route path="products/:slug" element={<ShopProductDetailsPage />} />
              <Route path="cart" element={<ShopCartPage />} />
              <Route path="checkout" element={<ShopCheckoutPage />} />
              <Route path="order/:id" element={<ShopOrderSuccessPage />} />
            </Route>

            <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Navigate to="/analytics/overview" replace />} />
            <Route path="/analytics/overview" element={<AnalyticsOverview />} />
            <Route path="/analytics/advanced" element={<AdvancedAnalytics />} />
            <Route path="/analytics/realtime" element={<RealTimeAnalytics />} />
            <Route path="/analytics/bi" element={<BusinessIntelligence />} />
            <Route path="/analytics/reports" element={<ReportBuilder />} />
            <Route path="/commerce/products" element={<ProductsPage />} />
            <Route path="/commerce/products/new" element={<ProductManagementPage />} />
            <Route path="/commerce/products/:id" element={<ProductManagementPage />} />
            <Route path="/commerce/categories" element={<CategoriesPage />} />
            <Route path="/commerce/banners" element={<BannersPage />} />
            <Route path="/commerce/orders" element={<OrdersPage />} />
            <Route path="/commerce/inventory" element={<InventoryPage />} />
            <Route path="/commerce/payments" element={<PaymentsManagementPage />} />
            
            <Route path="/users" element={<UsersManagementPage />} />
            <Route path="/campaigns" element={<Navigate to="/campaigns/dashboard" replace />} />
            <Route path="/campaigns/getting-started" element={<GettingStartedPage />} />
            <Route path="/campaigns/dashboard" element={<CampaignDashboard />} />
            <Route path="/campaigns/list" element={<CampaignsPage />} />
            <Route path="/campaigns/setup" element={<MetaSetupPage />} />
            <Route path="/campaigns/tracking" element={<EventTrackingPage />} />
            <Route path="/content" element={<ContentPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:categoryId/subcategories" element={<SubCategoriesPage />} />
            <Route path="/media" element={<MediaLibraryPage />} />
            <Route path="/content/notifications" element={<NotificationsPage />} />
            <Route path="/audit-logs" element={<AuditLogsPage />} />
            <Route path="/data-management" element={<DataManagementPage />} />
            <Route path="/ai-automation" element={<AIAutomationPage />} />
            <Route path="/plugins" element={<PluginsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/reviews/pending" element={<ReviewsPage defaultFilter="pending" />} />
            <Route path="/reviews/approved" element={<ReviewsPage defaultFilter="approved" />} />
            <Route path="/reviews/rejected" element={<ReviewsPage defaultFilter="rejected" />} />
            <Route path="/reviews/analytics" element={<ReviewsAnalyticsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
