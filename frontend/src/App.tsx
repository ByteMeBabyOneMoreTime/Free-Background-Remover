import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/home";
import ProcessedImages from "./pages/processImages";
import Footer from "./components/footer";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/processed" element={<ProcessedImages />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
