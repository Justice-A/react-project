import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Transfer from "./pages/Transfer";
import Bill from "./pages/Bill";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="transfer" element={<Transfer />} />
        <Route path="bill" element={<Bill />} />
      </Routes>
    </Router>
  );
}

export default App;
