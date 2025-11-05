import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
