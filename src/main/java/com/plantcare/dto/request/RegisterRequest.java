package com.plantcare.dto.request;

import com.plantcare.enums.GardeningExperience;
import com.plantcare.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank
    @Email
    @Pattern(regexp = "(?i).*@gmail\\.com", message = "Only @gmail.com email addresses are allowed")
    private String email;

    @NotBlank
    @Size(min = 6)
    private String password;

    private String fullName;
    private String location;
    private GardeningExperience gardeningExperience;
    private String timezone;
    private UserRole role;
}
