import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { Header } from "./components/layout/Header";
import Auth from "./components/auth/Layout";
import LoginUser from "./pages/auth/Login";
import RegisterUser from "./pages/auth/Register";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route element={<Auth />}>
          <Route
            path="/login"
            element={ <LoginUser /> } />
          <Route
            path="/register"
            element={<RegisterUser/>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
