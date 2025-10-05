import { ProcessingResult } from '../contexts/AppContext';

// Mock OCR text samples for different document types
const mockOcrTexts = {
  nationalId: `REPUBLIC OF KENYA
NATIONAL IDENTITY CARD

ID NO: 12345678
NAME: JOHN MWANGI DOE
DATE OF BIRTH: 15/03/1985
PLACE OF BIRTH: NAIROBI
SEX: MALE
DISTRICT OF BIRTH: NAIROBI
DIVISION: WESTLANDS
LOCATION: KILIMANI
SUB-LOCATION: KILELESHWA

SIGNATURE: [Signature Present]
DATE OF ISSUE: 20/01/2020
SERIAL NO: A1234567B`,

  bankStatement: `EQUITY BANK LIMITED
STATEMENT OF ACCOUNT

Account Name: JOHN MWANGI DOE
Account Number: 1234567890
Branch: NAIROBI WESTLANDS
Statement Period: 01/01/2024 - 31/01/2024

DATE        DESCRIPTION                    DEBIT      CREDIT     BALANCE
01/01/2024  Opening Balance                              0.00      0.00
05/01/2024  SALARY CREDIT                2,500.00             2,500.00
10/01/2024  ATM WITHDRAWAL                200.00             2,300.00
15/01/2024  MOBILE MONEY DEPOSIT          500.00             2,800.00
20/01/2024  BILL PAYMENT                   150.00             2,650.00
25/01/2024  TRANSFER TO SAVINGS            300.00             2,350.00
31/01/2024  Closing Balance                              0.00  2,350.00`,

  passport: `REPUBLIC OF KENYA
PASSPORT

PASSPORT NO: A1234567
SURNAME: DOE
GIVEN NAMES: JOHN MWANGI
NATIONALITY: KENYAN
DATE OF BIRTH: 15/03/1985
PLACE OF BIRTH: NAIROBI, KENYA
SEX: MALE
DATE OF ISSUE: 20/01/2020
DATE OF EXPIRY: 19/01/2030
AUTHORITY: REPUBLIC OF KENYA`,

  drivingLicense: `REPUBLIC OF KENYA
DRIVING LICENSE

LICENSE NO: A123456789
NAME: JOHN MWANGI DOE
DATE OF BIRTH: 15/03/1985
ADDRESS: P.O. BOX 12345, NAIROBI
CLASS: B, C1
DATE OF ISSUE: 20/01/2020
DATE OF EXPIRY: 19/01/2026
SIGNATURE: [Signature Present]`
};

// Mock extracted data based on document type
const mockExtractedData = {
  nationalId: {
    idNumber: "12345678",
    fullName: "JOHN MWANGI DOE",
    dateOfBirth: "15/03/1985",
    placeOfBirth: "NAIROBI",
    gender: "MALE",
    district: "NAIROBI",
    division: "WESTLANDS",
    location: "KILIMANI",
    subLocation: "KILELESHWA",
    dateOfIssue: "20/01/2020",
    serialNumber: "A1234567B"
  },
  bankStatement: {
    bankName: "EQUITY BANK LIMITED",
    accountName: "JOHN MWANGI DOE",
    accountNumber: "1234567890",
    branch: "NAIROBI WESTLANDS",
    statementPeriod: "01/01/2024 - 31/01/2024",
    openingBalance: 0.00,
    closingBalance: 2350.00,
    totalDebits: 650.00,
    totalCredits: 3000.00
  },
  passport: {
    passportNumber: "A1234567",
    surname: "DOE",
    givenNames: "JOHN MWANGI",
    nationality: "KENYAN",
    dateOfBirth: "15/03/1985",
    placeOfBirth: "NAIROBI, KENYA",
    gender: "MALE",
    dateOfIssue: "20/01/2020",
    dateOfExpiry: "19/01/2030"
  },
  drivingLicense: {
    licenseNumber: "A123456789",
    fullName: "JOHN MWANGI DOE",
    dateOfBirth: "15/03/1985",
    address: "P.O. BOX 12345, NAIROBI",
    classes: "B, C1",
    dateOfIssue: "20/01/2020",
    dateOfExpiry: "19/01/2026"
  }
};

// Simulate document type detection based on filename
function detectDocumentType(filename: string): keyof typeof mockOcrTexts {
  const lowerName = filename.toLowerCase();
  
  if (lowerName.includes('id') || lowerName.includes('national')) {
    return 'nationalId';
  } else if (lowerName.includes('bank') || lowerName.includes('statement')) {
    return 'bankStatement';
  } else if (lowerName.includes('passport')) {
    return 'passport';
  } else if (lowerName.includes('driving') || lowerName.includes('license')) {
    return 'drivingLicense';
  }
  
  // Default to national ID
  return 'nationalId';
}

// Simulate processing delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mock API function to process a document
export async function processDocument(file: File): Promise<ProcessingResult> {
  const startTime = Date.now();
  
  // Simulate processing delay (1-3 seconds)
  const processingTime = Math.random() * 2000 + 1000;
  await delay(processingTime);
  
  const documentType = detectDocumentType(file.name);
  const actualProcessingTime = Date.now() - startTime;
  
  // Generate random confidence (85-99%)
  const confidence = Math.random() * 14 + 85;
  
  // Determine fields detected (based on document type)
  const totalFields = Object.keys(mockExtractedData[documentType]).length;
  const fieldsDetected = Math.floor(totalFields * (confidence / 100));
  
  const result: ProcessingResult = {
    id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'completed',
    confidence: Math.round(confidence * 10) / 10,
    processingTime: Math.round(actualProcessingTime),
    documentType: documentType === 'nationalId' ? 'National ID' : 
                 documentType === 'bankStatement' ? 'Bank Statement' :
                 documentType === 'passport' ? 'Passport' : 'Driving License',
    country: 'Kenya',
    fieldsDetected,
    totalFields,
    ocrText: mockOcrTexts[documentType],
    extractedData: mockExtractedData[documentType]
  };
  
  return result;
}

// Mock function to simulate processing with real-time updates
export async function processDocumentWithUpdates(
  file: File,
  onUpdate: (result: Partial<ProcessingResult>) => void
): Promise<ProcessingResult> {
  const resultId = `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Initial state
  onUpdate({
    id: resultId,
    status: 'processing',
    confidence: 0,
    processingTime: 0,
    documentType: 'Detecting...',
    country: 'Unknown',
    fieldsDetected: 0,
    totalFields: 0,
    ocrText: '',
    extractedData: {}
  });
  
  // Simulate processing stages
  await delay(500);
  onUpdate({ documentType: 'Analyzing document...' });
  
  await delay(800);
  onUpdate({ country: 'Kenya' });
  
  await delay(600);
  const documentType = detectDocumentType(file.name);
  onUpdate({ 
    documentType: documentType === 'nationalId' ? 'National ID' : 
                 documentType === 'bankStatement' ? 'Bank Statement' :
                 documentType === 'passport' ? 'Passport' : 'Driving License'
  });
  
  await delay(700);
  onUpdate({ ocrText: mockOcrTexts[documentType] });
  
  await delay(500);
  const totalFields = Object.keys(mockExtractedData[documentType]).length;
  const confidence = Math.random() * 14 + 85;
  const fieldsDetected = Math.floor(totalFields * (confidence / 100));
  
  onUpdate({
    fieldsDetected,
    totalFields,
    confidence: Math.round(confidence * 10) / 10
  });
  
  await delay(300);
  
  const finalResult: ProcessingResult = {
    id: resultId,
    status: 'completed',
    confidence: Math.round(confidence * 10) / 10,
    processingTime: Date.now() - parseInt(resultId.split('_')[1]),
    documentType: documentType === 'nationalId' ? 'National ID' : 
                 documentType === 'bankStatement' ? 'Bank Statement' :
                 documentType === 'passport' ? 'Passport' : 'Driving License',
    country: 'Kenya',
    fieldsDetected,
    totalFields,
    ocrText: mockOcrTexts[documentType],
    extractedData: mockExtractedData[documentType]
  };
  
  onUpdate(finalResult);
  
  return finalResult;
}
