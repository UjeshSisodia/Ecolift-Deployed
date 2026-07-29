import api from "./axiosConfig";

// ---------- Passenger ----------

export const createBooking = async (rideId, seatsBooked) => {
  const res = await api.post("/bookings", { rideId, seatsBooked });
  return res.data;
};

export const getMyBookings = async () => {
  const res = await api.get("/bookings/my");
  return res.data;
};

export const cancelBooking = async (bookingId) => {
  const res = await api.patch(`/bookings/${bookingId}/cancel`);
  return res.data;
};

// ---------- Driver ----------

export const getDriverBookings = async () => {
  const res = await api.get("/bookings/driver");
  return res.data;
};

export const getDriverPendingBookings = async () => {
  const res = await api.get("/bookings/driver/pending");
  return res.data;
};

export const approveBooking = async (bookingId) => {
  const res = await api.patch(`/bookings/${bookingId}/approve`);
  return res.data;
};

export const rejectBooking = async (bookingId) => {
  const res = await api.patch(`/bookings/${bookingId}/reject`);
  return res.data;
};