import { DocumentCard } from "./DocumentCard";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search } from "lucide-react";

const mockDocuments = [
  {
    id: "DOC_2024_001",
    name: "passport_scan_john_doe.pdf",
    status: "completed" as const,
    confidence: 98,
    processingTime: "2.3s",
    uploadDate: "Oct 10, 2025",
    extractedData: {
      documentType: "Passport",
      fullName: "John Doe",
      passportNumber: "N123456789",
      dateOfBirth: "1990-05-15",
      expiryDate: "2030-05-15",
      nationality: "United States",
    },
  },
  {
    id: "DOC_2024_002",
    name: "drivers_license_front.jpg",
    status: "completed" as const,
    confidence: 95,
    processingTime: "1.8s",
    uploadDate: "Oct 9, 2025",
    extractedData: {
      documentType: "Driver's License",
      fullName: "Jane Smith",
      licenseNumber: "DL987654321",
      dateOfBirth: "1985-08-22",
      expiryDate: "2028-08-22",
      address: "123 Main St, New York, NY",
    },
  },
  {
    id: "DOC_2024_003",
    name: "national_id_scan.pdf",
    status: "processing" as const,
    uploadDate: "Oct 10, 2025",
  },
  {
    id: "DOC_2024_004",
    name: "utility_bill_verification.jpg",
    status: "failed" as const,
    uploadDate: "Oct 8, 2025",
  },
  {
    id: "DOC_2024_005",
    name: "bank_statement_august.pdf",
    status: "completed" as const,
    confidence: 92,
    processingTime: "3.1s",
    uploadDate: "Oct 7, 2025",
    extractedData: {
      documentType: "Bank Statement",
      accountHolder: "Robert Johnson",
      accountNumber: "****6789",
      statementDate: "August 2025",
      balance: "$5,234.56",
    },
  },
];

export function ResultsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1>Processing Results</h1>
        <p className="text-muted-foreground mt-1">View and manage all processed documents</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-10"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="recent">
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="confidence">Highest Confidence</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Grid */}
      <div className="grid gap-4">
        {mockDocuments.map((doc) => (
          <DocumentCard key={doc.id} {...doc} />
        ))}
      </div>
    </div>
  );
}
