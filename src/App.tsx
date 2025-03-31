import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/hooks/use-cart";
import { StoreInfoProvider } from "@/hooks/use-store-info";
import { ThemeColorsProvider } from "@/hooks/use-theme-colors";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import EditCarousel from "./pages/admin/EditCarousel";
import EditProducts from "./pages/admin/EditProducts";
import EditStoreName from "./pages/admin/EditStoreName";
import EditWhatsApp from "./pages/admin/EditWhatsApp";
import EditTheme from "./pages/admin/EditTheme";
import EditSocialLinks from "./pages/admin/EditSocialLinks";
import Product from "./pages/Product";
import Cart from "./pages/Cart";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StoreInfoProvider>
        <ThemeColorsProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/produto/:id" element={<Product />} />
                <Route path="/carrinho" element={<Cart />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/carrossel" element={<EditCarousel />} />
                <Route path="/admin/produtos" element={<EditProducts />} />
                <Route path="/admin/nome-loja" element={<EditStoreName />} />
                <Route path="/admin/whatsapp" element={<EditWhatsApp />} />
                <Route path="/admin/tema" element={<EditTheme />} />
                <Route path="/admin/social" element={<EditSocialLinks />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </ThemeColorsProvider>
      </StoreInfoProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
