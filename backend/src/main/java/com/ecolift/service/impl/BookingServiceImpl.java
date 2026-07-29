package com.ecolift.service.impl;

import com.ecolift.entity.Booking;
import com.ecolift.entity.Ride;
import com.ecolift.entity.User;
import com.ecolift.exception.DuplicateResourceException;
import com.ecolift.exception.InvalidRideStateException;
import com.ecolift.exception.ResourceNotFoundException;
import com.ecolift.exception.UnauthorizedActionException;
import com.ecolift.repository.BookingRepository;
import com.ecolift.service.BookingService;
import com.ecolift.service.RideService;
import com.ecolift.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final RideService rideService;
    private final UserService userService;

    public BookingServiceImpl(BookingRepository bookingRepository, RideService rideService, UserService userService) {
        this.bookingRepository = bookingRepository;
        this.rideService = rideService;
        this.userService = userService;
    }

    @Override
    public Booking save(Booking booking) {
        return bookingRepository.save(booking);
    }

    @Override
    public Booking update(Long id, Booking bookingDetails) {
        Booking booking = findById(id);
        booking.setStatus(bookingDetails.getStatus());
        return bookingRepository.save(booking);
    }

    @Override
    public void delete(Long id) {
        Booking booking = findById(id);
        bookingRepository.delete(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public Booking findById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> findAll() {
        return bookingRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean exists(Long id) {
        return bookingRepository.existsById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public long count() {
        return bookingRepository.count();
    }

    @Override
    public Booking createBooking(Long rideId, Long passengerId, int requestedSeats) {
        Ride ride = rideService.findById(rideId);
        User passenger = userService.getPassengerProfile(passengerId); // throws if user isn't a PASSENGER

        // Validation 1: Check if the ride was deleted/cancelled
        if (Boolean.TRUE.equals(ride.getIsDeleted())) {
            throw new InvalidRideStateException("Cannot book a ride that has been cancelled.");
        }

        // Validation 2: Check if the ride has already departed (doubles as
        // the "completed ride" check - Ride has no separate status field)
        if (ride.getDepartureTime() != null && ride.getDepartureTime().isBefore(LocalDateTime.now())) {
            throw new InvalidRideStateException("Cannot book a ride that has already departed.");
        }

        // Validation 3 (new): a driver can't book their own ride as a passenger
        if (ride.getDriver() != null && ride.getDriver().getId().equals(passengerId)) {
            throw new UnauthorizedActionException("You cannot book your own ride.");
        }

        // Validation 4 (tightened): only an existing PENDING/CONFIRMED booking
        // counts as a duplicate - a previously cancelled/rejected booking
        // shouldn't permanently block rebooking the same ride.
        boolean hasActiveBooking = bookingRepository.existsByRideIdAndPassengerIdAndStatusIn(
                rideId, passengerId, List.of(Booking.BookingStatus.PENDING, Booking.BookingStatus.CONFIRMED));
        if (hasActiveBooking) {
            throw new DuplicateResourceException("You have already booked this ride.");
        }

        // Validation 5 (new): don't accept requests for more seats than the
        // ride currently has - this is a "can this even theoretically fit"
        // check. It does NOT reserve/deduct seats; that happens on approval
        // (see approveBooking), since multiple passengers may legitimately
        // have overlapping PENDING requests for the same ride.
        if (requestedSeats > ride.getAvailableSeats()) {
            throw new com.ecolift.exception.SeatUnavailableException(
                    "This ride does not have " + requestedSeats + " seat(s) available.");
        }

        Booking booking = new Booking();
        booking.setBookingReference(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setRide(ride);
        booking.setPassenger(passenger);
        booking.setSeatsBooked(requestedSeats);
        booking.setStatus(Booking.BookingStatus.PENDING);

        // Use BigDecimal for accurate financial calculation based on pricePerSeat
        BigDecimal total = ride.getPricePerSeat().multiply(BigDecimal.valueOf(requestedSeats));
        booking.setTotalPrice(total);

        return bookingRepository.save(booking);
    }

    @Override
    public Booking cancelBooking(Long bookingId, Long passengerId) {
        Booking booking = findById(bookingId);

        // Authorization: only the passenger who made the booking can cancel it
        if (!booking.getPassenger().getId().equals(passengerId)) {
            throw new UnauthorizedActionException("You are not authorized to cancel this booking.");
        }

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED
                || booking.getStatus() == Booking.BookingStatus.REJECTED
                || booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            throw new InvalidRideStateException("This booking can no longer be cancelled (status: " + booking.getStatus() + ").");
        }

        // Only restore seats if they were actually deducted, i.e. the booking
        // had been approved (CONFIRMED). A still-PENDING booking never
        // touched availableSeats, so there's nothing to give back.
        if (booking.getStatus() == Booking.BookingStatus.CONFIRMED) {
            rideService.updateAvailableSeats(booking.getRide().getId(), -booking.getSeatsBooked());
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setCancellationTime(LocalDateTime.now());
        booking.setCancellationReason("Cancelled by user");
        return bookingRepository.save(booking);
    }

    @Override
    public Booking approveBooking(Long bookingId, Long driverId) {
        Booking booking = findById(bookingId);

        // Authorization: only the ride's own driver can approve a request for it
        if (!booking.getRide().getDriver().getId().equals(driverId)) {
            throw new UnauthorizedActionException("You are not authorized to approve this booking.");
        }

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new InvalidRideStateException("Only pending bookings can be approved (status: " + booking.getStatus() + ").");
        }

        // Seats are reserved here, not at request time. updateAvailableSeats
        // throws SeatUnavailableException on its own if this would go
        // negative - i.e. this is exactly the "approving beyond available
        // seats" guard.
        rideService.updateAvailableSeats(booking.getRide().getId(), booking.getSeatsBooked());

        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }

    @Override
    public Booking rejectBooking(Long bookingId, Long driverId) {
        Booking booking = findById(bookingId);

        // Authorization: only the ride's own driver can reject a request for it
        if (!booking.getRide().getDriver().getId().equals(driverId)) {
            throw new UnauthorizedActionException("You are not authorized to reject this booking.");
        }

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new InvalidRideStateException("Only pending bookings can be rejected (status: " + booking.getStatus() + ").");
        }

        // No seat restore needed - a PENDING booking never had seats deducted.
        booking.setStatus(Booking.BookingStatus.REJECTED);
        return bookingRepository.save(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> getBookingsByPassenger(Long passengerId) {
        return bookingRepository.findByPassengerId(passengerId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> getBookingsByRide(Long rideId) {
        return bookingRepository.findByRideId(rideId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> getBookingsForDriver(Long driverId) {
        return bookingRepository.findByRideDriverId(driverId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> getPendingBookingsForDriver(Long driverId) {
        return bookingRepository.findByRideDriverIdAndStatus(driverId, Booking.BookingStatus.PENDING);
    }

    @Override
    @Transactional(readOnly = true)
    public Double calculateTotalFare(Long bookingId) {
        Booking booking = findById(bookingId);
        return booking.getTotalPrice().doubleValue();
    }
}