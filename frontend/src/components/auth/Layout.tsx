import { Outlet } from "react-router-dom";

const Auth = () => {
  return (
    <section className="w-full min-h-screen bg-gray-900 flex items-center justify-center">
      <Outlet />
    </section>
  );
};

export default Auth;
