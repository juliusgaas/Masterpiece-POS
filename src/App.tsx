import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import NewSale from "./pages/NewSale";
import ProtectedRoute from "./routes/ProtectedRoute";
import QuotationPage from "./pages/quotation/page";
import MainLayout from "./components/MainLayout";
import QuotationDetails from "./components/quotation/quotation-page";

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
                    path="/quotations"
                    element={<QuotationPage />}
                />

                <Route
                    path="/quotations/create"
                    element={<QuotationDetails />}
                />
                <Route
                    path="/quotations/:id/edit"
                    element={<QuotationDetails />}
                />

            </Route>
        </Routes>
  );
}

export default App;