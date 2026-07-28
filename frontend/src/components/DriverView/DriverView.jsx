import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Users,
  Send,
  Car,
  Plus,
  ArrowLeft,
  IndianRupee,
  AlertCircle,
  X,
} from "lucide-react";
import api from "../../api/axiosConfig";

const DriverView = () => {
  const navigate = useNavigate();

  // Global Error for API failures
  const [error, setError] = useState(null);
  
  // Inline Errors for form validation
  const [errors, setErrors] = useState({});

  // Form State
  const [rideDetails, setRideDetails] = useState({
    source: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    availableSeats: 1,
    pricePerSeat: "",
  });

  // Flow State
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activeVehicles, setActiveVehicles] = useState([]);
  const [vehicleLoading, setVehicleLoading] = useState(true);
  const [vehicleError, setVehicleError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRideDetails((prev) => ({ ...prev, [name]: value }));

    // Real-time field validation
    let fieldError = "";
    if (value.trim() === "") {
      fieldError = "This field is required";
    } else {
      if ((name === "source" || name === "destination") && value.trim().length < 3) {
        fieldError = "Must be at least 3 characters";
      } else if (name === "pricePerSeat" && Number(value) < 10) {
        fieldError = "Price must be at least ₹10";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  // Calculate minimum allowed time (2 hours from now)
  const getMinDateTime = () => {
    const date = new Date();
    date.setHours(date.getHours() + 2);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const minDateTime = getMinDateTime();

  useEffect(() => {
    const fetchVehicles = async () => {
      setVehicleLoading(true);
      setVehicleError("");

      try {
        const response = await api.get("/v1/vehicles/my");
        const vehicles = Array.isArray(response.data) ? response.data : [];
        setActiveVehicles(vehicles.filter((vehicle) => vehicle.status === "ACTIVE"));
        if (vehicles.length > 0) {
          setSelectedVehicle(vehicles.find((v) => v.status === "ACTIVE") || null);
        }
      } catch (error) {
        setVehicleError("Unable to load your vehicles. Please try again.");
      } finally {
        setVehicleLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleContinue = (e) => {
    e.preventDefault();
    setError(null);
    
    const newErrors = {};
    let hasError = false;

    if (!rideDetails.source.trim()) {
      newErrors.source = "Origin is required";
      hasError = true;
    } else if (rideDetails.source.trim().length < 3) {
      newErrors.source = "Must be at least 3 characters";
      hasError = true;
    }

    if (!rideDetails.destination.trim()) {
      newErrors.destination = "Destination is required";
      hasError = true;
    } else if (rideDetails.destination.trim().length < 3) {
      newErrors.destination = "Must be at least 3 characters";
      hasError = true;
    }

    if (!rideDetails.pricePerSeat) {
      newErrors.pricePerSeat = "Price is required";
      hasError = true;
    } else if (Number(rideDetails.pricePerSeat) < 10) {
      newErrors.pricePerSeat = "Price must be at least ₹10";
      hasError = true;
    }

    if (!rideDetails.departureTime) {
      newErrors.departureTime = "Departure time is required";
      hasError = true;
    } else {
      const selectedTime = new Date(rideDetails.departureTime);
      selectedTime.setSeconds(0, 0);

      const minAllowedTime = new Date();
      minAllowedTime.setHours(minAllowedTime.getHours() + 2);
      minAllowedTime.setSeconds(0, 0);

      if (selectedTime < minAllowedTime) {
        newErrors.departureTime = "Must be at least 2 hours from now";
        hasError = true;
      }
    }

    if (!rideDetails.arrivalTime) {
      newErrors.arrivalTime = "Arrival time is required";
      hasError = true;
    } else if (rideDetails.departureTime) {
      const arrivalTime = new Date(rideDetails.arrivalTime);
      arrivalTime.setSeconds(0, 0);

      const selectedTime = new Date(rideDetails.departureTime);
      selectedTime.setSeconds(0, 0);

      if (arrivalTime <= selectedTime) {
        newErrors.arrivalTime = "Must be after departure time";
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (activeVehicles.length > 0) {
      setSelectedVehicle(activeVehicles[0]);
    }
    setStep(2);
  };

  const handleFinalPublish = (e) => {
    e.preventDefault();

    if (!selectedVehicle) return;

    setError(null);

    const payload = {
      vehicleId: selectedVehicle.id,
      departureLocationId: rideDetails.sourceLocationId || null,
      arrivalLocationId: rideDetails.destinationLocationId || null,
      departureCity: rideDetails.source,
      arrivalCity: rideDetails.destination,
      departureTime: rideDetails.departureTime,
      estimateArrivalTime: rideDetails.arrivalTime,
      availableSeats: Number(rideDetails.availableSeats),
      pricePerSeat: Number(rideDetails.pricePerSeat),
    };

    api
      .post("/rides", payload)
      .then((res) => {
        navigate("/driver/rides");
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || "Failed to publish ride.";
        setError(msg);
      });
  };

  return (
    // Wrapped in the exact same bright card style as PassengerView
    <div className="w-full bg-white rounded-2xl shadow-2xl p-6">
      
      {/* Quick nav to the driver's published rides list */}
      {step === 1 && (
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Publish a Ride</h2>
          <button
            type="button"
            onClick={() => navigate("/driver/rides")}
            className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
          >
            <Car className="h-4 w-4" />
            My Rides
          </button>
        </div>
      )}

      {/* STEP 1: Ride Details Form */}
      {step === 1 && (
        <form
          onSubmit={handleContinue}
          noValidate
          className="animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          {error && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-600 mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="rounded-full p-1 text-red-400 transition hover:bg-red-100 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Changed to a 3-column grid for a wider, cleaner look */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Source */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500 ml-1">Origin</label>
              <div
                className={`flex items-center gap-2 rounded-xl border bg-slate-50 px-3.5 py-3 transition focus-within:bg-white focus-within:ring-2 ${
                  errors.source
                    ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
                    : "border-slate-200 focus-within:border-emerald-500 focus-within:ring-emerald-100"
                }`}
              >
                <MapPin className={`h-5 w-5 shrink-0 ${errors.source ? "text-red-500" : "text-emerald-600"}`} />
                <input
                  type="text"
                  name="source"
                  value={rideDetails.source}
                  onChange={handleChange}
                  placeholder="Pick-up Location"
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
              {errors.source && <p className="text-red-500 text-xs ml-1">{errors.source}</p>}
            </div>

            {/* Destination */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500 ml-1">Destination</label>
              <div
                className={`flex items-center gap-2 rounded-xl border bg-slate-50 px-3.5 py-3 transition focus-within:bg-white focus-within:ring-2 ${
                  errors.destination
                    ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
                    : "border-slate-200 focus-within:border-emerald-500 focus-within:ring-emerald-100"
                }`}
              >
                <MapPin className={`h-5 w-5 shrink-0 ${errors.destination ? "text-red-500" : "text-emerald-600"}`} />
                <input
                  type="text"
                  name="destination"
                  value={rideDetails.destination}
                  onChange={handleChange}
                  placeholder="Drop-off Location"
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
              {errors.destination && <p className="text-red-500 text-xs ml-1">{errors.destination}</p>}
            </div>

            {/* Price Per Seat */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500 ml-1">Price per Seat (₹)</label>
              <div
                className={`flex items-center gap-2 rounded-xl border bg-slate-50 px-3.5 py-3 transition focus-within:bg-white focus-within:ring-2 ${
                  errors.pricePerSeat
                    ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
                    : "border-slate-200 focus-within:border-emerald-500 focus-within:ring-emerald-100"
                }`}
              >
                <IndianRupee className={`h-5 w-5 shrink-0 ${errors.pricePerSeat ? "text-red-500" : "text-emerald-600"}`} />
                <input
                  type="number"
                  name="pricePerSeat"
                  value={rideDetails.pricePerSeat}
                  onChange={handleChange}
                  placeholder="Min ₹10"
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
              {errors.pricePerSeat && <p className="text-red-500 text-xs ml-1">{errors.pricePerSeat}</p>}
            </div>

            {/* Departure Time */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500 ml-1">Departure Time</label>
              <div
                className={`flex items-center gap-2 rounded-xl border bg-slate-50 px-3.5 py-3 transition focus-within:bg-white focus-within:ring-2 ${
                  errors.departureTime
                    ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
                    : "border-slate-200 focus-within:border-emerald-500 focus-within:ring-emerald-100"
                }`}
              >
                <Clock className={`h-5 w-5 shrink-0 ${errors.departureTime ? "text-red-500" : "text-emerald-600"}`} />
                <input
                  type="datetime-local"
                  name="departureTime"
                  value={rideDetails.departureTime}
                  onChange={handleChange}
                  min={minDateTime}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none"
                />
              </div>
              {errors.departureTime && <p className="text-red-500 text-xs ml-1">{errors.departureTime}</p>}
            </div>

            {/* Arrival Time */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500 ml-1">Estimated Arrival</label>
              <div
                className={`flex items-center gap-2 rounded-xl border bg-slate-50 px-3.5 py-3 transition focus-within:bg-white focus-within:ring-2 ${
                  errors.arrivalTime
                    ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
                    : "border-slate-200 focus-within:border-emerald-500 focus-within:ring-emerald-100"
                }`}
              >
                <Clock className={`h-5 w-5 shrink-0 ${errors.arrivalTime ? "text-red-500" : "text-emerald-600"}`} />
                <input
                  type="datetime-local"
                  name="arrivalTime"
                  value={rideDetails.arrivalTime}
                  onChange={handleChange}
                  min={rideDetails.departureTime || minDateTime}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none"
                />
              </div>
              {errors.arrivalTime && <p className="text-red-500 text-xs ml-1">{errors.arrivalTime}</p>}
            </div>

            {/* Available Seats */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500 ml-1">Available Seats</label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
                <Users className="h-5 w-5 text-emerald-600 shrink-0" />
                <select
                  name="availableSeats"
                  value={rideDetails.availableSeats}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Seat Available" : "Seats Available"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-green-700 hover:bg-green-800 px-8 py-3.5 text-sm font-semibold text-white shadow-md transition  active:scale-[0.98] w-full md:w-auto"
            >
              <span>Continue</span>
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: Vehicle Selection */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <button
              onClick={() => setStep(1)}
              className="p-2 hover:bg-slate-100 text-slate-600 rounded-full transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h3 className="font-semibold text-slate-800 text-lg">
                Select your vehicle
              </h3>
              <p className="text-xs text-slate-500">
                {activeVehicles.length === 0
                  ? "You need to add a vehicle before publishing a ride."
                  : "Which car are you driving for this trip?"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle)}
                className={`p-4 rounded-xl cursor-pointer border-2 transition-all ${
                  selectedVehicle?.id === vehicle.id
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 hover:border-emerald-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Car className="text-emerald-700 h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800">
                      {vehicle.vehicleName}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      {vehicle.vehicleNumber}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                navigate("/register-vehicle", {
                  state: { savedRide: rideDetails },
                })
              }
              className="p-4 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 hover:border-emerald-500 hover:bg-emerald-50 transition-all group min-h-[88px]"
            >
              <Plus className="text-slate-400 group-hover:text-emerald-600 transition" />
              <span className="text-sm font-medium text-slate-500 group-hover:text-emerald-700 transition">
                Add new vehicle
              </span>
            </button>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleFinalPublish}
              disabled={!selectedVehicle}
              className={`flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold text-white shadow-md transition ${
                selectedVehicle
                  ? "bg-green-700 hover:bg-green-800 active:scale-[0.98]"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              <Send className="h-4 w-4" />
              <span>Confirm & Publish</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverView;