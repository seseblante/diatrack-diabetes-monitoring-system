package app.hub_backend.entities.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum GlucoseContext {
    BEFORE_MEAL("Before Meal"),
    AFTER_MEAL("After Meal"),
    FASTING("Fasting"),
    BEDTIME("Bedtime"),      // <-- ADD THIS
    RANDOM("Random"),        // <-- ADD THIS
    OTHER("Other");          // <-- ADD THIS

    private final String displayName;

    GlucoseContext(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }
}