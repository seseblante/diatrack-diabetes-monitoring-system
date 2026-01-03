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
    console.error('=== PDF EXPORT FAILED ===');
    console.error('Status:', response.status, response.statusText);
    console.error('Response body:', errorText);
    console.error('Patient ID:', patientId);
    console.error('========================');
    throw new Error(`Failed to export report: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  // Check content type before parsing as blob
  const contentType = response.headers.get('Content-Type') || '';
  
  // If backend returned HTML/JSON error instead of PDF, read it as text
  if (contentType.includes('html') || contentType.includes('json')) {
    const errorContent = await response.text();
    console.error('=== BACKEND ERROR (NOT PDF) ===');
    console.error('Content-Type:', contentType);
    console.error('Response body:', errorContent);
    console.error('==============================');
    
    // Try to extract meaningful error from HTML
    let errorMessage = 'Backend error - check console for details';
    if (errorContent.includes('Whitelabel Error Page')) {
      const match = errorContent.match(/<div>([^<]+)<\/div>/);
      if (match) errorMessage = match[1];
    }
    
    throw new Error(`Backend error: ${errorMessage}`);
  }
  
  const blob = await response.blob();
  
  // Log blob details for debugging
  console.log('=== PDF BLOB RECEIVED ===');
  console.log('Blob type:', blob.type);
  console.log('Blob size:', blob.size, 'bytes');
  console.log('Content-Type header:', contentType);
  console.log('========================');
  
  // Verify it's actually a PDF
  const isPdf = blob.type === 'application/pdf' || 
                blob.type.includes('pdf') || 
                contentType.includes('pdf');
  
  if (!isPdf) {
    console.error('Invalid PDF response:');
    console.error('- Blob type:', blob.type);
    console.error('- Content-Type:', contentType);
    console.error('- Blob size:', blob.size);
    throw new Error('Server did not return a valid PDF file');
  }
  
  if (blob.size === 0) {
    console.error('Empty PDF received (0 bytes)');
    throw new Error('Server returned an empty PDF file');
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
