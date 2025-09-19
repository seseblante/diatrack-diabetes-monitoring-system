package app.hub_backend.serviceImpl;


import app.hub_backend.DTO.LoginRequest;
import app.hub_backend.DTO.LoginResponse;
import app.hub_backend.DTO.RegisterRequest;
import app.hub_backend.entities.Role;
import app.hub_backend.entities.User;
import app.hub_backend.mapper.UserMapper;
import app.hub_backend.repositories.UserRepository;
import app.hub_backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authManager;
    private final UserRepository users;
    private final BCryptPasswordEncoder encoder;

    @Override
    public LoginResponse login(LoginRequest req, HttpServletRequest httpReq, HttpServletResponse httpRes) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password())
        );
        SecurityContext ctx = SecurityContextHolder.createEmptyContext();
        ctx.setAuthentication(auth);
        SecurityContextHolder.setContext(ctx);
        httpReq.getSession(true); // create session if absent
        new HttpSessionSecurityContextRepository().saveContext(ctx, httpReq, httpRes);

        User user = users.findByEmailIgnoreCase(req.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        return new LoginResponse(UserMapper.toDto(user));
    }

    @Override
    public void logout(HttpServletRequest httpReq) {
        var session = httpReq.getSession(false);
        if (session != null) session.invalidate();
        SecurityContextHolder.clearContext();
    }

    @Override
    public User currentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return null;
        String email = auth.getName();
        return users.findByEmailIgnoreCase(email).orElse(null);
    }

    @Override
    public User register(RegisterRequest req) {
        if (users.existsByEmailIgnoreCase(req.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }
        User u = User.builder()
                .email(req.email())
                .passwordHash(encoder.encode(req.password()))
                .fullName(req.fullName())
                .phone(req.phone())
                .role(req.role() == null ? Role.PATIENT : req.role())
                .isActive(true)
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();
        return users.save(u);
    }
}