package com.ecolift.dto.response;

import com.ecolift.entity.UserMode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String gender;
    private LocalDate dateOfBirth;
    private String profilePictureUrl;
    private LocalDateTime joinedDate;
    private UserMode currentMode;
    private List<String> roles;

    // ---- Account statistics ----
    // Only fields backed by data that already exists elsewhere in the app
    // (Booking/Ride/Review modules) are included here. Anything without a
    // real data source (e.g. "carbon saved") is intentionally left out of
    // the API and shown as a frontend-only placeholder instead - see
    // ProfileStats.jsx.
    private Integer totalBookings;
    private Integer publishedRides;
    private Integer completedTrips;
    private Double averageRating; // null until the user has at least one review
}
