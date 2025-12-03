/**
 * Export patient report as PDF
 * @param patientId Patient UUID
 * @returns PDF blob
 */
export async function exportPatientReportPdf(patientId: string): Promise<Blob> {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/export/patient/${patientId}/pdf`, {
    method: 'GET',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('PDF export failed:', errorText);
    throw new Error(`Failed to export report: ${response.statusText}`);
  }
  
  const blob = await response.blob();
  
  // Verify it's actually a PDF
  if (blob.type !== 'application/pdf' && !blob.type.includes('pdf')) {
    console.error('Received non-PDF content:', blob.type);
    throw new Error('Server did not return a valid PDF file');
  }
  
  return blob;
}

/**
 * Download patient report as PDF
 * @param patientId Patient UUID
 * @param filename Optional filename for download
 */
export async function downloadPatientReportPdf(patientId: string, filename?: string): Promise<void> {
  const blob = await exportPatientReportPdf(patientId);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `patient_report_${patientId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
