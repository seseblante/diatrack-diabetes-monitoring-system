package app.hub_backend.controllers;

import app.hub_backend.DTO.LoginRequest;
import app.hub_backend.DTO.LoginResponse;
import app.hub_backend.DTO.RegisterRequest;
import app.hub_backend.DTO.UserDto;
import app.hub_backend.entities.User;
import app.hub_backend.mapper.UserMapper;
import app.hub_backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService auth;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req,
                                               HttpServletRequest httpReq,
                                               HttpServletResponse httpRes) {
        return ResponseEntity.ok(auth.login(req, httpReq, httpRes));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest httpReq) {
        auth.logout(httpReq);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me() {
        User u = auth.currentUser();
        if (u == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(UserMapper.toDto(u));
    }

    // Optional: quick seeding endpoint during development
    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@Valid @RequestBody RegisterRequest req) {
        User u = auth.register(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(UserMapper.toDto(u));
    }
}
