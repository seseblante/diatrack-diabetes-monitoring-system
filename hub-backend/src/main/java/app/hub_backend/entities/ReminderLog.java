package app.hub_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "reminder_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReminderLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reminder_id", nullable = false)
    private Reminder reminder;

    @Column(nullable = false)
    private OffsetDateTime scheduledFor;

    @Column(nullable = false)
    private String status;

    private OffsetDateTime actedAt;
}