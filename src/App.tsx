import { Route, Routes } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import BackToTopButton from "./components/BackToTopButton";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Service from "./pages/services/Service";
import Contact from "./pages/contact/Contact";
import Auth from "./pages/auth/Auth";
import Terms from "./pages/terms/Terms";


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
      <Footer />
      <BackToTopButton />
    </>
  );
}

export default App;
