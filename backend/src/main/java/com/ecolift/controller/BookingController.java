package com.ecolift.controller;

import com.ecolift.dto.request.BookingRequest;
import com.ecolift.dto.response.BookingResponse;
import com.ecolift.entity.Booking;
import com.ecolift.entity.User;
import com.ecolift.mapper.BookingMapper;
import com.ecolift.repository.UserRepository;
import com.ecolift.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    public BookingController(BookingService bookingService, UserRepository userRepository) {
        this.bookingService = bookingService;
        this.userRepository = userRepository;
    }

    // ---------- Passenger endpoints ----------

    /**
     * Request a seat on a ride. Creates a PENDING booking - seats are only
     * reserved once the driver approves it (see BookingServiceImpl).
     */
    @PostMapping
    @PreAuthorize("hasRole('PASSENGER')")
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication
    ) {
        User passenger = resolveUser(authentication);

        Booking booking = bookingService.createBooking(
                request.getRideId(),
                passenger.getId(),
                request.getSeatsBooked()
        );

        return new ResponseEntity<>(BookingMapper.toResponse(booking), HttpStatus.CREATED);
    }

    /**
     * All bookings made by the currently logged-in passenger, regardless of status.
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('PASSENGER')")
    public ResponseEntity<List<BookingResponse>> getMyBookings(Authentication authentication) {
        User passenger = resolveUser(authentication);

        List<BookingResponse> responses = bookingService.getBookingsByPassenger(passenger.getId())
                .stream()
                .map(BookingMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    /**
     * Cancel one of the passenger's own bookings.
     */
    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasRole('PASSENGER')")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User passenger = resolveUser(authentication);
        Booking booking = bookingService.cancelBooking(id, passenger.getId());
        return ResponseEntity.ok(BookingMapper.toResponse(booking));
    }

    // ---------- Driver endpoints ----------

    /**
     * All booking requests across every ride the logged-in driver offers.
     */
    @GetMapping("/driver")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<List<BookingResponse>> getDriverBookings(Authentication authentication) {
        User driver = resolveUser(authentication);

        List<BookingResponse> responses = bookingService.getBookingsForDriver(driver.getId())
                .stream()
                .map(BookingMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    /**
     * Just the PENDING requests awaiting this driver's decision.
     */
    @GetMapping("/driver/pending")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<List<BookingResponse>> getDriverPendingBookings(Authentication authentication) {
        User driver = resolveUser(authentication);

        List<BookingResponse> responses = bookingService.getPendingBookingsForDriver(driver.getId())
                .stream()
                .map(BookingMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    /**
     * Approve a pending request. Reserves the seats on the ride at this point.
     */
    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<BookingResponse> approveBooking(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User driver = resolveUser(authentication);
        Booking booking = bookingService.approveBooking(id, driver.getId());
        return ResponseEntity.ok(BookingMapper.toResponse(booking));
    }

    /**
     * Reject a pending request. No seats to release since none were reserved yet.
     */
    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<BookingResponse> rejectBooking(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User driver = resolveUser(authentication);
        Booking booking = bookingService.rejectBooking(id, driver.getId());
        return ResponseEntity.ok(BookingMapper.toResponse(booking));
    }

    // ---------- Shared helper ----------

    /**
     * Resolves the calling user from the JWT, mirroring the exact pattern
     * RideController already uses (Authentication -> email -> UserRepository).
     */
    private User resolveUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}