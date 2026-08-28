import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import NewSale from "./pages/NewSale";
import ProtectedRoute from "./routes/ProtectedRoute";
import QuotationPage from "./pages/quotation/quotation-page";
import MainLayout from "./components/MainLayout";

function App() {
  return (
    <Routes>

           {/* Login */}
            <Route
                path="/"
                element={<Login />}
            />

             {/* Protected Pages */}
            <Route
                element={
                <ProtectedRoute>
                    <MainLayout />
                </ProtectedRoute>
                }
            >

                {/* POS */}
                <Route
                path="/new-sale"
                element={<NewSale />}
                />

                {/* Quotation */}
                <Route
                path="/quotation"
                element={<QuotationPage />}
                />

            </Route>
        </Routes>
  );
}

export default App;