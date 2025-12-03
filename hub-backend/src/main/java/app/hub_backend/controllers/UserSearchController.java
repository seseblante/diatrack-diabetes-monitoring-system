package app.hub_backend.controllers;

import app.hub_backend.DTO.patient.PatientDetailDto;
import app.hub_backend.entities.User;
import app.hub_backend.entities.UserProfile;
import app.hub_backend.mapper.UserMapper;
import app.hub_backend.repositories.UserProfileRepository;
import app.hub_backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserSearchController {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    @GetMapping("/search")
    public ResponseEntity<List<PatientDetailDto>> searchUsers(@RequestParam String query) {
        log.info("Searching for patients with query: {}", query);
        // Search by email only (case-insensitive)
        List<User> users = userRepository.findByEmailContainingIgnoreCase(query);
        
        // Filter only patients and map to DTOs
        List<PatientDetailDto> patients = users.stream()
                .filter(user -> "PATIENT".equalsIgnoreCase(user.getRole()))
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(patients);
    }
    
    private PatientDetailDto convertToDto(User user) {
        UserProfile profile = userProfileRepository.findById(user.getId()).orElse(null);
        return UserMapper.toPatientDetailDto(user, profile);
    }
}
