import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import Stats from "../../components/Stats/Stats";
import FeaturedRides from "../../components/FeaturedRides/FeaturedRides";
import CTA from "../../components/CTA/CTA";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { isAuthenticated, currentMode } = useAuth();

  const renderAuthenticatedModeContent = () => {
    if (currentMode === "DRIVER") {
      return (
        <section className="px-4 py-10 md:py-14">
          <div className="mx-auto max-w-6xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-700">
              Driver Mode Active
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              Driver Dashboard will be available in Phase 3.
            </h2>
            <p className="mt-4 text-gray-600">
              This placeholder verifies that your selected mode is active and the UI is switching correctly.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <h3 className="font-semibold text-gray-900">Publish Ride</h3>
                <p className="mt-2 text-sm text-gray-600">Coming soon</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <h3 className="font-semibold text-gray-900">My Vehicles</h3>
                <p className="mt-2 text-sm text-gray-600">Coming soon</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <h3 className="font-semibold text-gray-900">My Rides</h3>
                <p className="mt-2 text-sm text-gray-600">Coming soon</p>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="px-4 py-10 md:py-14">
        <div className="mx-auto max-w-6xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-700">
            Passenger Mode Active
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900">
            Search for your next ride.
          </h2>
          <p className="mt-4 text-gray-600">
            Your mode is now active. The existing search experience remains available for this phase.
          </p>
        </div>
      </section>
    );
  };

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {!isAuthenticated ? (
          <>
            <Hero />
            <HowItWorks />
            <Stats />
            <FeaturedRides />
            <CTA />
          </>
        ) : (
          <>
            <Hero />
            {renderAuthenticatedModeContent()}
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Home;
