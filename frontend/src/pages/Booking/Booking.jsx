import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride;

  if (!ride) {
    return (
      <>
        <Navbar />
        <main className="pt-20 bg-linear-to-b from-emerald-50 via-white to-gray-50 min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md rounded-2xl bg-white p-6 text-center shadow-sm border border-emerald-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No ride selected</h1>
            <p className="text-gray-600 mb-4">
              Please choose a ride from the search results first.
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
            >
              Back to Home
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-linear-to-b from-emerald-50 via-white to-gray-50 min-h-screen px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-[28px] bg-white p-8 shadow-[0_12px_40px_rgba(21,128,61,0.08)] border border-emerald-100">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-700">
            Confirm your ride
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Booking Summary</h1>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-sm text-gray-500">Driver</p>
              <p className="text-lg font-semibold text-gray-900">{ride.driverName}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-sm text-gray-500">Vehicle</p>
              <p className="text-lg font-semibold text-gray-900">{ride.vehicleModel}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-sm text-gray-500">From</p>
              <p className="text-lg font-semibold text-gray-900">{ride.departureLocationName}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-sm text-gray-500">To</p>
              <p className="text-lg font-semibold text-gray-900">{ride.arrivalLocationName}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4 md:col-span-2">
              <p className="text-sm text-gray-500">Departure</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(ride.departureTime).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-4">
            <div className="flex items-center justify-between gap-3 flex-col sm:flex-row">
              <div>
                <p className="text-sm text-gray-600">Price per seat</p>
                <p className="text-2xl font-bold text-green-700">₹{ride.pricePerSeat}</p>
              </div>
              <button
                type="button"
                className="rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Booking;
