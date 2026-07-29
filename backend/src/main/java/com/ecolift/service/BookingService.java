package com.ecolift.service;

import com.ecolift.entity.Booking;
import java.util.List;

public interface BookingService {
    Booking save(Booking booking);
    Booking update(Long id, Booking booking);
    void delete(Long id);
    Booking findById(Long id);
    List<Booking> findAll();
    boolean exists(Long id);
    long count();

    Booking createBooking(Long rideId, Long passengerId, int requestedSeats);

    // Added passengerId/driverId params: these actions must only be
    // performable by the booking's own passenger / the ride's own driver.
    // No BookingController existed before this change, so nothing external
    // depended on the old signatures.
    Booking cancelBooking(Long bookingId, Long passengerId);
    Booking approveBooking(Long bookingId, Long driverId);
    Booking rejectBooking(Long bookingId, Long driverId);

    List<Booking> getBookingsByPassenger(Long passengerId);
    List<Booking> getBookingsByRide(Long rideId);
    Double calculateTotalFare(Long bookingId);

    // New: driver-facing views across all of a driver's rides.
    List<Booking> getBookingsForDriver(Long driverId);
    List<Booking> getPendingBookingsForDriver(Long driverId);
}