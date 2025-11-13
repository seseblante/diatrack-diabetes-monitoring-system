package app.hub_backend.serviceImpl;

import app.hub_backend.entities.User;
import app.hub_backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository users;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User u = users.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        if (!u.isActive()) {
            throw new UsernameNotFoundException("User inactive");
        }
        // --- THIS IS THE CHANGE ---
        List<GrantedAuthority> auth = List.of(new SimpleGrantedAuthority("ROLE_" + u.getRole()));
        // --- END OF CHANGE ---
        return new org.springframework.security.core.userdetails.User(
                u.getEmail(),
                u.getPasswordHash() == null ? "" : u.getPasswordHash(),
                auth
        );
    }
}