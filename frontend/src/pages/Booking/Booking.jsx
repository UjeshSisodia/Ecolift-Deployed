import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { createBooking } from "../../api/bookingService";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride;

  const maxSeats = Math.max(1, Number(ride?.availableSeats) || 1);
  const [seats, setSeats] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

  const totalPrice = (Number(ride.pricePerSeat) || 0) * seats;

  const handleConfirm = async () => {
    setError("");
    setSubmitting(true);
    try {
      await createBooking(ride.rideId, seats);
      setSuccess(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong while booking this ride. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <main className="pt-20 bg-linear-to-b from-emerald-50 via-white to-gray-50 min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm border border-emerald-100">
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Request sent!
            </h1>
            <p className="text-gray-600 mb-6">
              Your booking request has been sent to the driver. You'll see it
              move to "Confirmed" once they approve it.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => navigate("/bookings/my")}
                className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
              >
                View My Bookings
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-xl border border-green-200 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
              >
                Back to Home
              </button>
            </div>
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

          {/* Seat selector - capped at whatever the ride currently reports as available */}
          <div className="mt-6 rounded-2xl bg-emerald-50 p-4">
            <p className="text-sm text-gray-500 mb-2">Seats needed</p>
            <div className="flex items-center gap-3">
              <select
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-green-600"
              >
                {Array.from({ length: maxSeats }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "seat" : "seats"}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-500">
                {ride.availableSeats} seat{ride.availableSeats === 1 ? "" : "s"} available on this ride
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-4">
            <div className="flex items-center justify-between gap-3 flex-col sm:flex-row">
              <div>
                <p className="text-sm text-gray-600">Total price</p>
                <p className="text-2xl font-bold text-green-700">₹{totalPrice}</p>
                <p className="text-xs text-gray-500">
                  ₹{ride.pricePerSeat} × {seats} seat{seats === 1 ? "" : "s"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={submitting}
                className="rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
              >
                {submitting ? "Sending request..." : "Confirm Booking"}
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