import React, { useState } from "react";
import { MapPin, Clock, Users, DollarSign, Send } from "lucide-react";

const DriverView = () => {
  const [rideDetails, setRideDetails] = useState({
    source: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    availableSeats: 1,
    pricePerSeat: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRideDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePublish = (e) => {
    e.preventDefault();
    console.log("Publishing ride details:", rideDetails);
    // Integration logic for POST /api/v1/rides will go here
  };

  return (
    <div className="w-full">
      <form onSubmit={handlePublish} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Source */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
            <MapPin className="h-5 w-5 text-emerald-600 shrink-0" />
            <input
              type="text"
              name="source"
              value={rideDetails.source}
              onChange={handleChange}
              placeholder="Origin / Pick-up Location"
              required
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Destination */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
            <MapPin className="h-5 w-5 text-emerald-600 shrink-0" />
            <input
              type="text"
              name="destination"
              value={rideDetails.destination}
              onChange={handleChange}
              placeholder="Destination / Drop-off Location"
              required
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Departure Time */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">Departure Time</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
              <Clock className="h-5 w-5 text-emerald-600 shrink-0" />
              <input
                type="datetime-local"
                name="departureTime"
                value={rideDetails.departureTime}
                onChange={handleChange}
                required
                className="w-full bg-transparent text-sm text-slate-800 outline-none"
              />
            </div>
          </div>

          {/* Arrival Time */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">Estimated Arrival Time</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
              <Clock className="h-5 w-5 text-emerald-600 shrink-0" />
              <input
                type="datetime-local"
                name="arrivalTime"
                value={rideDetails.arrivalTime}
                onChange={handleChange}
                required
                className="w-full bg-transparent text-sm text-slate-800 outline-none"
              />
            </div>
          </div>

          {/* Available Seats */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
            <Users className="h-5 w-5 text-emerald-600 shrink-0" />
            <select
              name="availableSeats"
              value={rideDetails.availableSeats}
              onChange={handleChange}
              className="w-full bg-transparent text-sm text-slate-800 outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Seat Available" : "Seats Available"}
                </option>
              ))}
            </select>
          </div>

          {/* Price Per Seat */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
            <DollarSign className="h-5 w-5 text-emerald-600 shrink-0" />
            <input
              type="number"
              name="pricePerSeat"
              min="0"
              value={rideDetails.pricePerSeat}
              onChange={handleChange}
              placeholder="Price per Seat"
              required
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 active:scale-[0.98]"
          >
            <Send className="h-4 w-4" />
            <span>Publish Ride</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriverView;