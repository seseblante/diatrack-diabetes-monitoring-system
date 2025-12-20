package app.hub_backend.repositories;

import app.hub_backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmailIgnoreCase(
            @Param("email") String email
    );

    boolean existsByEmailIgnoreCase(
            @Param("email") String email
    );

    List<User> findByEmailContainingIgnoreCaseOrFullNameContainingIgnoreCase(
            @Param("email") String email,
            @Param("fullName") String fullName
    );

    List<User> findByEmailContainingIgnoreCase(
            @Param("email") String email
    );
}
