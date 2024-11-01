import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import ProcessImages from "./pages/processImages";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/process" element={<ProcessImages />} />
        </Routes>
      </div>
    </Router>
  );
}
