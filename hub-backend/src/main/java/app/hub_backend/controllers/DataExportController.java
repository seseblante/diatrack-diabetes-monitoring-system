package app.hub_backend.controllers;

import app.hub_backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
public class DataExportController {

    private final ReportService reportService;

    @GetMapping("/patient/{patientId}/pdf")
    public ResponseEntity<byte[]> exportPatientReportPdf(
            @PathVariable("patientId") UUID patientId
    ) {
        byte[] pdfContents = reportService.generatePatientPdfReport(patientId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);

        String filename = "patient_report_" + patientId + ".pdf";
        headers.setContentDispositionFormData("attachment", filename);
        headers.setCacheControl("no-cache, no-store, must-revalidate");
        headers.setPragma("no-cache");
        headers.setExpires(0);

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfContents);
    }
}
