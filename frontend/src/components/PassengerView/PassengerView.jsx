import React, { useState } from "react";
import { MapPin, Calendar, Users, Search } from "lucide-react";

const PassengerView = () => {
  const [searchParams, setSearchParams] = useState({
    source: "",
    destination: "",
    date: "",
    passengers: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching rides with parameters:", searchParams);
    // Integration logic for GET /api/v1/rides/search will go here
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-4 md:flex-row md:items-center md:gap-3"
      >
        {/* Source Input */}
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
          <MapPin className="h-5 w-5 text-emerald-600 shrink-0" />
          <input
            type="text"
            name="source"
            value={searchParams.source}
            onChange={handleChange}
            placeholder="Leaving from..."
            required
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Destination Input */}
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
          <MapPin className="h-5 w-5 text-emerald-600 shrink-0" />
          <input
            type="text"
            name="destination"
            value={searchParams.destination}
            onChange={handleChange}
            placeholder="Going to..."
            required
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Date Input */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
          <Calendar className="h-5 w-5 text-emerald-600 shrink-0" />
          <input
            type="date"
            name="date"
            value={searchParams.date}
            onChange={handleChange}
            required
            className="bg-transparent text-sm text-slate-800 outline-none"
          />
        </div>

        {/* Passengers Dropdown */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
          <Users className="h-5 w-5 text-emerald-600 shrink-0" />
          <select
            name="passengers"
            value={searchParams.passengers}
            onChange={handleChange}
            className="bg-transparent text-sm text-slate-800 outline-none"
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Passenger" : "Passengers"}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 active:scale-[0.98]"
        >
          <Search className="h-4 w-4" />
          <span>Search Rides</span>
        </button>
      </form>
    </div>
  );
};

export default PassengerView;