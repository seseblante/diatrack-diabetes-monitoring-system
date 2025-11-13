package app.hub_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.time.OffsetTime; // Corrected from LocalTime to OffsetTime if you need timezone info
import java.time.LocalTime; // Or use LocalTime if you don't need timezone
import java.util.UUID;

@Entity
@Table(name = "reminders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String scheduleType;

    @Column(name = "time_of_day")
    private LocalTime timeOfDay; // For DAILY reminders

    // The "timezone" field was removed from here.

    private OffsetDateTime fireAtOnce; // For ONCE reminders

    @Column(nullable = false)
    private boolean isActive = true;

    private OffsetDateTime nextFireAt;

    @Column(nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}