import { Route, Routes } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import BackToTopButton from "./components/BackToTopButton";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import About from "./pages/About";


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
      <BackToTopButton />
    </>
  );
}

export default App;
