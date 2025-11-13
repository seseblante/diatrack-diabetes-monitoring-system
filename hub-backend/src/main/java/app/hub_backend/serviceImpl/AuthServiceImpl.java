package app.hub_backend.serviceImpl;

import app.hub_backend.DTO.auth.LoginRequestDto;
import app.hub_backend.DTO.auth.LoginResponseDto;
import app.hub_backend.DTO.auth.RegisterRequestDto;
import app.hub_backend.entities.User;
import app.hub_backend.mapper.UserMapper;
import app.hub_backend.repositories.UserRepository;
import app.hub_backend.service.AuthService;
import app.hub_backend.service.JwtService;
import app.hub_backend.service.PatientTargetRangeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;

    // --- [NEW] ---
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PatientTargetRangeService patientTargetRangeService; // <-- [NEW] INJECT
//    private final UserMapper userMapper; // Assuming you have a UserMapper

    @Override
    @Transactional
    public LoginResponseDto login(LoginRequestDto req) {
        // This part is the same
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.email(),
                        req.password()
                )
        );

        // [THIS IS THE FIX]
        // 1. Get the username (email) from the authenticated principal.
        // This avoids the ClassCastException completely.
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();

        // 2. Fetch your *full* User entity from the database.
        User user = users.findByEmailIgnoreCase(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found after login"));

        // 3. Generate the token and response
        String jwtToken = jwtService.generateToken(user);

        return new LoginResponseDto(UserMapper.toDto(user), jwtToken);
    }

    @Override
    public User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        }
        // This fallback handles if the principal is just the username string
        String username = ((UserDetails) principal).getUsername(); // <-- CORRECT
        return users.findByEmailIgnoreCase(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found from security context"));
    }

    @Override
    public User register(RegisterRequestDto req) {
        if (users.existsByEmailIgnoreCase(req.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }
        if (!req.isConsentGiven()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informed consent is required to register.");
        }

        User u = User.builder()
                .email(req.email())
                .passwordHash(encoder.encode(req.password()))
                .fullName(req.fullName())
                .phone(req.phone())
                .role(req.role() == null ? "PATIENT" : req.role())
                .isActive(true)
                .isConsentGiven(req.isConsentGiven())
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        User savedUser = users.save(u); // <-- Save the user first

        // --- [NEW] ---
        // This is the compromise: create the defaults automatically
        if ("PATIENT".equals(savedUser.getRole())) {
            patientTargetRangeService.createDefaultTargetsForNewPatient(savedUser);
        }
        // --- [END NEW] ---

        return savedUser;
    }
}