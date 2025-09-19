package app.hub_backend.service;

import app.hub_backend.DTO.LoginRequest;
import app.hub_backend.DTO.LoginResponse;
import app.hub_backend.DTO.RegisterRequest;
import app.hub_backend.entities.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {
    LoginResponse login(LoginRequest req, HttpServletRequest httpReq, HttpServletResponse httpRes);
    void logout(HttpServletRequest httpReq);
    User currentUser();
    User register(RegisterRequest req);
}