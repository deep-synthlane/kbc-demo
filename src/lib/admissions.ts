// Shared admission form fields, document types, and mock application data.

export const ADMISSION_REQUIRED_DOCS = [
  "10th Marksheet",
  "12th Marksheet",
  "Passport Photo",
  "Government ID Proof",
] as const;

export const ADMISSION_PROGRAMS = [
  "B.Tech CSE",
  "B.Tech ECE",
  "MBA",
  "B.Sc Data Science",
  "B.Tech MECH",
  "B.Tech CIVIL",
] as const;

export const APPLICATION_FEE = 1500;

export type AdmissionDocName = (typeof ADMISSION_REQUIRED_DOCS)[number];

export type ApplicationDocument = {
  name: AdmissionDocName;
  uploaded: boolean;
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
};

export type ApplicationStatus =
  | "Pending Review"
  | "Approved"
  | "Rejected"
  | "Documents Required";

export type AdmissionApplication = {
  id: string;
  name: string;
  program: string;
  status: ApplicationStatus;
  docs: "Complete" | "Incomplete";
  verified: boolean;
  meritScore: number | null;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  guardianName: string;
  address: string;
  tenthMarks: number;
  twelfthMarks: number;
  previousInstitution: string;
  entranceExamScore: number | null;
  paymentStatus: "Paid" | "Pending";
  documents: ApplicationDocument[];
};

const DOC_FILE_TEMPLATES: Record<
  AdmissionDocName,
  (slug: string) => { fileName: string; fileSize: string }
> = {
  "10th Marksheet": (slug) => ({
    fileName: `10th_marksheet_${slug}.pdf`,
    fileSize: "842 KB",
  }),
  "12th Marksheet": (slug) => ({
    fileName: `12th_marksheet_${slug}.pdf`,
    fileSize: "1.1 MB",
  }),
  "Passport Photo": (slug) => ({
    fileName: `passport_photo_${slug}.jpg`,
    fileSize: "248 KB",
  }),
  "Government ID Proof": (slug) => ({
    fileName: `aadhaar_${slug}.pdf`,
    fileSize: "456 KB",
  }),
};

function slugifyName(name: string) {
  return name.toLowerCase().replace(/\s+/g, "_");
}

export function buildApplicationDocuments(
  name: string,
  uploaded: Partial<Record<AdmissionDocName, boolean>>,
  uploadedAt = "18 Jun 2026",
): ApplicationDocument[] {
  const slug = slugifyName(name);
  return ADMISSION_REQUIRED_DOCS.map((docName) => {
    const isUploaded = uploaded[docName] ?? false;
    if (!isUploaded) return { name: docName, uploaded: false };
    const { fileName, fileSize } = DOC_FILE_TEMPLATES[docName](slug);
    return { name: docName, uploaded: true, fileName, fileSize, uploadedAt };
  });
}

function app(
  base: Omit<AdmissionApplication, "documents"> & {
    documentUploads: Partial<Record<AdmissionDocName, boolean>>;
  },
): AdmissionApplication {
  const { documentUploads, ...rest } = base;
  const documents = buildApplicationDocuments(base.name, documentUploads);
  const docs = documents.every((d) => d.uploaded) ? "Complete" : "Incomplete";
  return { ...rest, docs, documents };
}

export const APPLICATIONS: AdmissionApplication[] = [
  app({
    id: "AP-2026-0142",
    name: "Rohan Mehta",
    program: "B.Tech CSE",
    status: "Pending Review",
    docs: "Complete",
    verified: false,
    meritScore: null,
    email: "rohan.mehta@gmail.com",
    phone: "+91 98765 43210",
    dateOfBirth: "2005-03-14",
    gender: "Male",
    guardianName: "Rajesh Mehta",
    address: "12, Shanti Nagar, Satellite Road, Ahmedabad, Gujarat — 380015",
    tenthMarks: 92,
    twelfthMarks: 88,
    previousInstitution: "Delhi Public School, Ahmedabad",
    entranceExamScore: 285,
    paymentStatus: "Paid",
    documentUploads: {
      "10th Marksheet": true,
      "12th Marksheet": true,
      "Passport Photo": true,
      "Government ID Proof": true,
    },
  }),
  app({
    id: "AP-2026-0143",
    name: "Sneha Pillai",
    program: "B.Tech ECE",
    status: "Approved",
    docs: "Complete",
    verified: true,
    meritScore: 94.5,
    email: "sneha.pillai@outlook.com",
    phone: "+91 91234 56789",
    dateOfBirth: "2004-11-02",
    gender: "Female",
    guardianName: "Suresh Pillai",
    address: "45, MG Road, Kochi, Kerala — 682016",
    tenthMarks: 95,
    twelfthMarks: 94,
    previousInstitution: "Bhavan's Vidya Mandir, Kochi",
    entranceExamScore: 312,
    paymentStatus: "Paid",
    documentUploads: {
      "10th Marksheet": true,
      "12th Marksheet": true,
      "Passport Photo": true,
      "Government ID Proof": true,
    },
  }),
  app({
    id: "AP-2026-0144",
    name: "Vikram Singh",
    program: "MBA",
    status: "Documents Required",
    docs: "Incomplete",
    verified: false,
    meritScore: null,
    email: "vikram.singh@yahoo.com",
    phone: "+91 99887 76655",
    dateOfBirth: "1999-07-21",
    gender: "Male",
    guardianName: "Harpreet Singh",
    address: "78, Civil Lines, Ludhiana, Punjab — 141001",
    tenthMarks: 78,
    twelfthMarks: 82,
    previousInstitution: "DAV College, Ludhiana",
    entranceExamScore: 198,
    paymentStatus: "Paid",
    documentUploads: {
      "10th Marksheet": true,
      "12th Marksheet": true,
      "Passport Photo": false,
      "Government ID Proof": false,
    },
  }),
  app({
    id: "AP-2026-0145",
    name: "Lakshmi Narayan",
    program: "B.Tech MECH",
    status: "Pending Review",
    docs: "Complete",
    verified: false,
    meritScore: null,
    email: "lakshmi.n@rediffmail.com",
    phone: "+91 97654 32109",
    dateOfBirth: "2005-01-08",
    gender: "Female",
    guardianName: "Narayan Iyer",
    address: "23, Anna Salai, Chennai, Tamil Nadu — 600002",
    tenthMarks: 89,
    twelfthMarks: 86,
    previousInstitution: "PSBB Senior Secondary School, Chennai",
    entranceExamScore: 267,
    paymentStatus: "Paid",
    documentUploads: {
      "10th Marksheet": true,
      "12th Marksheet": true,
      "Passport Photo": true,
      "Government ID Proof": true,
    },
  }),
  app({
    id: "AP-2026-0146",
    name: "Aarav Kapoor",
    program: "B.Sc Data Science",
    status: "Approved",
    docs: "Complete",
    verified: true,
    meritScore: 91.2,
    email: "aarav.kapoor@gmail.com",
    phone: "+91 90123 45678",
    dateOfBirth: "2005-09-30",
    gender: "Male",
    guardianName: "Anil Kapoor",
    address: "5, Connaught Place, New Delhi — 110001",
    tenthMarks: 91,
    twelfthMarks: 90,
    previousInstitution: "Modern School, Barakhamba Road",
    entranceExamScore: 278,
    paymentStatus: "Paid",
    documentUploads: {
      "10th Marksheet": true,
      "12th Marksheet": true,
      "Passport Photo": true,
      "Government ID Proof": true,
    },
  }),
  app({
    id: "AP-2026-0147",
    name: "Diya Sharma",
    program: "B.Tech CSE",
    status: "Rejected",
    docs: "Complete",
    verified: true,
    meritScore: null,
    email: "diya.sharma@gmail.com",
    phone: "+91 88990 11223",
    dateOfBirth: "2005-06-18",
    gender: "Female",
    guardianName: "Ramesh Sharma",
    address: "67, Malviya Nagar, Jaipur, Rajasthan — 302017",
    tenthMarks: 72,
    twelfthMarks: 68,
    previousInstitution: "St. Xavier's School, Jaipur",
    entranceExamScore: 142,
    paymentStatus: "Paid",
    documentUploads: {
      "10th Marksheet": true,
      "12th Marksheet": true,
      "Passport Photo": true,
      "Government ID Proof": true,
    },
  }),
  app({
    id: "AP-2026-0148",
    name: "Karan Joshi",
    program: "B.Tech CIVIL",
    status: "Pending Review",
    docs: "Complete",
    verified: false,
    meritScore: null,
    email: "karan.joshi@proton.me",
    phone: "+91 93456 78901",
    dateOfBirth: "2004-12-25",
    gender: "Male",
    guardianName: "Mahesh Joshi",
    address: "14, FC Road, Pune, Maharashtra — 411004",
    tenthMarks: 87,
    twelfthMarks: 85,
    previousInstitution: "Fergusson College, Pune",
    entranceExamScore: 254,
    paymentStatus: "Paid",
    documentUploads: {
      "10th Marksheet": true,
      "12th Marksheet": true,
      "Passport Photo": true,
      "Government ID Proof": true,
    },
  }),
];
