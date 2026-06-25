import { Routes, Route } from "react-router-dom";
import CatalogPage from "./features/catalog/CatalogPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<CatalogPage />} />
    </Routes>
  );
};

export default App;
