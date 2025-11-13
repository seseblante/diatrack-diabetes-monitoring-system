package app.hub_backend.service;

import app.hub_backend.DTO.auth.LoginRequestDto;
import app.hub_backend.DTO.auth.LoginResponseDto;
import app.hub_backend.DTO.auth.RegisterRequestDto;
import app.hub_backend.entities.User;

// [MODIFIED] Simplified interface
public interface AuthService {
    LoginResponseDto login(LoginRequestDto req);
    User currentUser();
    User register(RegisterRequestDto req);
}