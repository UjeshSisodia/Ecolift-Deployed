import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 pt-20 text-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="rounded-full bg-red-50 p-4">
            <ShieldAlert className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Access Restricted
          </h1>
          <p className="max-w-sm text-sm text-slate-500">
            You don't have permission to view this page with your current
            account or mode. If you believe this is a mistake, try switching
            modes or logging back in.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700"
          >
            Back to Home
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Unauthorized;