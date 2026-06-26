import { Routes, Route } from "react-router-dom";
import CatalogPage from "./features/catalog/CatalogPage";
import CartIcon from "./features/cart/CartIcon";
import CartDrawer from "./features/cart/CartDrawer";

const App = () => {
  return (
    <>
      {/* Persistent header */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <span className="text-base font-bold tracking-tight text-gray-900">
            Komodo
          </span>
          <CartIcon />
        </div>
      </header>

      {/* Page content */}
      <Routes>
        <Route path="/" element={<CatalogPage />} />
      </Routes>

      {/* Cart drawer — rendered at app level so it overlays any page */}
      <CartDrawer />
    </>
  );
};

export default App;
