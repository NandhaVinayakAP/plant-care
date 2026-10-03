package com.plantcare.service;

import com.plantcare.dto.request.LoginRequest;
import com.plantcare.dto.request.RegisterRequest;
import com.plantcare.dto.response.AuthResponse;
import com.plantcare.entity.User;
import com.plantcare.enums.UserRole;
import com.plantcare.exception.PlantCareException;
import com.plantcare.repository.UserRepository;
import com.plantcare.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new PlantCareException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new PlantCareException("Email is already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setLocation(request.getLocation());
        user.setGardeningExperience(request.getGardeningExperience());
        user.setTimezone(request.getTimezone() != null ? request.getTimezone() : "UTC");
        user.setRole(request.getRole() != null ? request.getRole() : UserRole.STANDARD_PLANT_OWNER);
        user.setIsActive(true);
        user.setEmailVerified(false);

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getUsername(), savedUser.getRole().name(), savedUser.getId());
        String refreshToken = jwtUtil.generateRefreshToken(savedUser.getUsername());

        return new AuthResponse(token, refreshToken, "Bearer", savedUser.getId(),
                                savedUser.getUsername(), savedUser.getEmail(), savedUser.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .or(() -> userRepository.findByEmail(request.getUsername()))
                .orElseThrow(() -> new PlantCareException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new PlantCareException("Invalid username or password");
        }

        if (!user.getIsActive()) {
            throw new PlantCareException("Account is disabled");
        }

        user.setLastLogin(java.time.LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name(), user.getId());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());

        return new AuthResponse(token, refreshToken, "Bearer", user.getId(),
                                user.getUsername(), user.getEmail(), user.getRole());
    }
}
