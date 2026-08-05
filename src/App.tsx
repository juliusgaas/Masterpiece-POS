import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import NewSale from "./pages/NewSale";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>

            <Route
                path="/"
                element={<Login />}
            />

           <Route
                path="/new-sale"
                element={
                    <ProtectedRoute>
                        <NewSale />
                    </ProtectedRoute>
                }
            />

        </Routes>
  );
}

export default App;