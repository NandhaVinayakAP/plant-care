package com.plantcare.dto.response;

import com.plantcare.enums.GardeningExperience;
import com.plantcare.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private UserRole role;
    private Boolean isActive;
    private String location;
    private GardeningExperience gardeningExperience;
    private String bio;
    private String expertise;
    private LocalDateTime createdDate;
}
