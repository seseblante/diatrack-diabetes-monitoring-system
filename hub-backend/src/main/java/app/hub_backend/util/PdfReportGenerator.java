package app.hub_backend.util;

import app.hub_backend.entities.*;
import org.apache.pdfbox.pdmodel.PDDocument;
// ... (other imports) ...
import app.hub_backend.entities.enums.FrequencyType;
import app.hub_backend.entities.enums.GlucoseContext;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class PdfReportGenerator {

    // (Internal record Section and constants are unchanged)
    private record Section(String title, List<String> lines) {}
    private static final float MARGIN = 48f;
    private static final float TITLE_SIZE = 18f;
    private static final float H2_SIZE = 13f;
    private static final float TEXT_SIZE = 10f;

    // Define severe thresholds for summary
    private static final BigDecimal SEVERE_LOW_THRESHOLD = new BigDecimal("54.00");
    private static final BigDecimal SEVERE_HIGH_THRESHOLD = new BigDecimal("250.00");


    // --- [UPDATED] Method signature now accepts complianceStatus ---
    public byte[] generatePatientReport(User patient,
                                        List<GlucoseReading> glucoseReadings,
                                        List<MedicationRegimen> regimens,
                                        List<MedicationLog> medicationLogs,
                                        List<Meal> meals,
                                        // ActivityLogs removed
                                        List<SymptomNote> symptomNotes,
                                        List<ClinicianNote> clinicianNotes,
                                        String complianceStatus) { // <-- NEW ARGUMENT

        String title = "Patient Health Report";
        String subtitle = "Patient: " + patient.getFullName();

        List<Section> sections = new ArrayList<>();

        // --- [UPDATED] Pass complianceStatus to the summary section ---
        sections.add(createSummarySection(glucoseReadings, meals, medicationLogs, complianceStatus));

        // ... (All other sections for Clinician Notes, Meds, Glucose, etc. are unchanged) ...

        // 1. Clinician Notes Section
        if (clinicianNotes != null && !clinicianNotes.isEmpty()) {
            List<String> lines = clinicianNotes.stream()
                    .map(this::formatClinicianNote)
                    .collect(Collectors.toList());
            sections.add(new Section("Clinician Notes", lines));
        }

        // 2. Medication Regimen Section
        if (regimens != null && !regimens.isEmpty()) {
            List<String> lines = regimens.stream()
                    .map(this::formatRegimen)
                    .collect(Collectors.toList());
            sections.add(new Section("Current Medication Regimens", lines));
        }

        // 3. Medication Adherence Section
        if (medicationLogs != null && !medicationLogs.isEmpty()) {
            List<String> lines = medicationLogs.stream()
                    .map(this::formatMedicationLog)
                    .collect(Collectors.toList());
            sections.add(new Section("Recent Medication Logs", lines));
        }

        // 4. Glucose Readings Section
        if (glucoseReadings != null && !glucoseReadings.isEmpty()) {
            List<String> lines = glucoseReadings.stream()
                    .map(this::formatGlucoseReading)
                    .collect(Collectors.toList());
            sections.add(new Section("Recent Glucose Readings", lines));
        }

        // 5. Symptom Logs Section
        if (symptomNotes != null && !symptomNotes.isEmpty()) {
            List<String> lines = symptomNotes.stream()
                    .map(this::formatSymptomNote)
                    .collect(Collectors.toList());
            sections.add(new Section("Recent Symptom Notes", lines));
        }

        // 6. Meal Logs Section
        if (meals != null && !meals.isEmpty()) {
            List<String> lines = meals.stream()
                    .map(this::formatMeal)
                    .collect(Collectors.toList());
            sections.add(new Section("Recent Meals", lines));
        }

        return buildPdf(title, subtitle, sections);
    }

    // --- (buildPdf method is unchanged) ---
    private byte[] buildPdf(String title, String subtitle, List<Section> sections) {
        // ... (No changes here) ...
        try (PDDocument doc = new PDDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PDFont fontReg;
            PDFont fontBold;
            try (var reg = getClass().getResourceAsStream("/fonts/NotoSans-Regular.ttf");
                 var bold = getClass().getResourceAsStream("/fonts/NotoSans-Bold.ttf")) {
                if (reg == null || bold == null) {
                    throw new IOException("Font files not found in resources/fonts/");
                }
                fontReg  = PDType0Font.load(doc, reg);
                fontBold = PDType0Font.load(doc, bold);
            }
            Writer w = new Writer(doc, PDRectangle.A4);
            w.ensureSpace(TITLE_SIZE + 8);
            w.textLine(title, fontBold, TITLE_SIZE);
            if (subtitle != null && !subtitle.isBlank()) {
                w.ensureSpace(TEXT_SIZE + 10);
                w.textLine(subtitle, fontReg, TEXT_SIZE);
                w.down(12);
            }
            if (sections != null) {
                for (Section s : sections) {
                    if (s.title != null && !s.title.isBlank()) {
                        w.ensureSpace(H2_SIZE + 8);
                        w.textLine(s.title, fontBold, H2_SIZE);
                        w.down(4);
                    }
                    if (s.lines != null) {
                        for (String line : s.lines) {
                            w.paragraph(line, fontReg, TEXT_SIZE);
                            w.down(8);
                        }
                    }
                }
            }
            w.close();
            doc.save(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    // --- [UPDATED] Summary Section Helper ---

    private Section createSummarySection(List<GlucoseReading> glucoseReadings, List<Meal> meals, List<MedicationLog> medLogs, String complianceStatus) { // <-- NEW ARGUMENT

        // --- [NEW] Add Compliance to the summary list ---
        List<String> summaryLines = new ArrayList<>();
        summaryLines.add("Medication Compliance: " + complianceStatus); // <-- NEW LINE

        if (glucoseReadings == null || glucoseReadings.isEmpty()) {
            summaryLines.add("No glucose data available for this period.");
            return new Section("At-a-Glance Summary", summaryLines);
        }

        double avgGlucose = glucoseReadings.stream()
                .mapToDouble(r -> r.getValueMgdl().doubleValue())
                .average()
                .orElse(0.0);

        long severeHighs = glucoseReadings.stream()
                .filter(r -> r.getValueMgdl().compareTo(SEVERE_HIGH_THRESHOLD) >= 0)
                .count();

        long severeLows = glucoseReadings.stream()
                .filter(r -> r.getValueMgdl().compareTo(SEVERE_LOW_THRESHOLD) <= 0)
                .count();

        // Add the rest of the stats
        summaryLines.add(String.format("Average Glucose: %.1f mg/dL", avgGlucose));
        summaryLines.add("Severe High Alerts (> 250): " + severeHighs);
        summaryLines.add("Severe Low Alerts (< 54): " + severeLows);
        summaryLines.add("Total Glucose Readings: " + glucoseReadings.size());
        summaryLines.add("Total Meals Logged: " + (meals != null ? meals.size() : 0));
        summaryLines.add("Total Medications Logged: " + (medLogs != null ? medLogs.size() : 0));

        return new Section("At-a-Glance Summary", summaryLines);
    }

    // --- (All other format... helpers and the Writer class are unchanged) ---
    // ... (formatRegimen, formatScheduleDetails, formatGlucoseReading, ...)
    // ... (formatMeal, formatClinicianNote, formatMedicationLog, ...)
    // ... (formatSymptomNote)
    // ... (Writer class)
    private String formatRegimen(MedicationRegimen r) {
        String dose = (r.getDoseAmount() != null && r.getDoseUnit() != null)
                ? r.getDoseAmount().stripTrailingZeros().toPlainString() + " " + r.getDoseUnit()
                : "N/A";
        return r.getMedicationName() + " (" + dose + ")\nSchedule: " + formatScheduleDetails(r);
    }

    private String formatScheduleDetails(MedicationRegimen r) {
        String schedule = switch (r.getFrequencyType()) {
            case DAILY -> r.getFrequencyValue() + (r.getFrequencyValue() > 1 ? " times a day" : " time a day");
            case WEEKLY -> "Every " + (r.getFrequencyValue() > 1 ? r.getFrequencyValue() + " weeks" : "week");
            case MONTHLY -> "Every " + (r.getFrequencyValue() > 1 ? r.getFrequencyValue() + " months" : "month");
            case CUSTOM_DAYS -> "Every " + r.getFrequencyValue() + " days";
        };
        return schedule;
    }

    private String formatGlucoseReading(GlucoseReading r) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM d, yyyy, h:mm a");
        String context = (r.getContext() != null) ? r.getContext().getDisplayName() : "N/A";
        return r.getMeasuredAt().format(formatter) + ": " + r.getValueMgdl() + " mg/dL (" + context + ")";
    }

    private String formatMeal(Meal m) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM d, h:mm a");
        String carbs = (m.getCarbsG() != null) ? " - " + m.getCarbsG().stripTrailingZeros().toPlainString() + "g carbs" : "";
        return m.getLoggedAt().format(formatter) + ": " + m.getDescription() + carbs;
    }

    private String formatClinicianNote(ClinicianNote n) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM d, yyyy");
        return "Note from " + n.getUpdatedAt().format(formatter) + ":\n" + n.getNoteContent();
    }

    private String formatMedicationLog(MedicationLog log) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM d, h:mm a");
        String medName = (log.getRegimen() != null && log.getRegimen().getMedicationName() != null)
                ? log.getRegimen().getMedicationName()
                : "Unknown Medication";
        return log.getTakenAt().format(formatter) + ": Took " + medName;
    }

    private String formatSymptomNote(SymptomNote s) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM d, h:mm a");
        String notes = (s.getNotes() != null && !s.getNotes().isBlank()) ? " - " + s.getNotes() : "";
        return s.getOccurredAt().format(formatter) + ": Felt " + s.getSymptom() + notes;
    }

    private static class Writer {
        private final PDDocument doc;
        private PDPageContentStream cs;
        private final float width;
        private float y;

        Writer(PDDocument doc, PDRectangle size) throws IOException {
            this.doc = doc;
            this.width = size.getWidth() - 2 * MARGIN;
            newPage();
        }

        void ensureSpace(float needed) throws IOException {
            if (y - needed < MARGIN) newPage();
        }

        void newPage() throws IOException {
            if (cs != null) cs.close();
            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);
            cs = new PDPageContentStream(doc, page);
            y = page.getMediaBox().getHeight() - MARGIN;
        }

        void textLine(String text, PDFont font, float fontSize) throws IOException {
            ensureSpace(fontSize + 2);
            cs.beginText();
            cs.setFont(font, fontSize);
            cs.newLineAtOffset(MARGIN, y);
            cs.showText(text);
            cs.endText();
            y -= (1.2f * fontSize);
        }

        void paragraph(String text, PDFont font, float fontSize) throws IOException {
            List<String> lines = wrap(text, font, fontSize, width);
            for (String line : lines) {
                textLine(line, font, fontSize);
                y += (0.2f * fontSize); // Adjust for tighter paragraph line spacing
            }
        }

        void down(float px) throws IOException {
            ensureSpace(px);
            y -= px;
        }

        void close() throws IOException {
            if (cs != null) cs.close();
        }

        private static List<String> wrap(String text, PDFont font, float fontSize, float maxWidth) throws IOException {
            List<String> lines = new ArrayList<>();
            for (String line : text.split("\n")) {
                String[] words = line.split(" ");
                StringBuilder currentLine = new StringBuilder();
                for (String word : words) {
                    float width = font.getStringWidth(currentLine + (currentLine.isEmpty() ? "" : " ") + word) / 1000 * fontSize;
                    if (width > maxWidth) {
                        lines.add(currentLine.toString());
                        currentLine = new StringBuilder(word);
                    } else {
                        if (!currentLine.isEmpty()) currentLine.append(" ");
                        currentLine.append(word);
                    }
                }
                lines.add(currentLine.toString());
            }
            return lines;
        }
    }
}