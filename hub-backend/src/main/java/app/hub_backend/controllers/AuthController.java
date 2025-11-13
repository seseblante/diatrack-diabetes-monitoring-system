package app.hub_backend.controllers;

import app.hub_backend.DTO.auth.LoginRequestDto;
import app.hub_backend.DTO.auth.LoginResponseDto;
import app.hub_backend.DTO.auth.RegisterRequestDto;
import app.hub_backend.DTO.auth.UserDto;
import app.hub_backend.entities.User;
import app.hub_backend.mapper.UserMapper;
import app.hub_backend.service.AuthService;
// [REMOVED] HttpServletRequest/Response imports
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
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto req) {
        return ResponseEntity.ok(auth.login(req));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me() {
        User u = auth.currentUser();
        return ResponseEntity.ok(UserMapper.toDto(u));
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@Valid @RequestBody RegisterRequestDto req) {
        User u = auth.register(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(UserMapper.toDto(u));
    }
}