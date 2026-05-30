import { Route, Routes } from "react-router-dom";

import { UserProvider } from "./context/UserContext";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import BackToTopButton from "./components/BackToTopButton";

import Home from "./pages/home/Home";
import NotFound from "./pages/not-found/NotFound";
import About from "./pages/about/About";
import Service from "./pages/services/Service";
import Contact from "./pages/contact/Contact";
import Auth from "./pages/auth/Auth";
import Terms from "./pages/terms/Terms";
import Privacy from "./pages/privacy/Privacy";
import Profile from "./pages/profile/Profile";


function App() {
  return (
    <UserProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
      <BackToTopButton />
    </UserProvider>
  );
}

export default App;
