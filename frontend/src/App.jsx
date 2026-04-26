import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Predict from "./pages/Predict";

import History from "./pages/History";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AIChat from "./components/AIChat";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">

        <Navbar />

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/predict" element={<Predict />} />

            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        {/* ✅ ADD THIS LINE */}
        <AIChat />

      </div>
    </BrowserRouter>
  );
}

export default App;