import jsPDF from "jspdf";
import QRCode from "qrcode";
import type { StoredApplication } from "./applicationStore";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function downloadReceipt(app: StoredApplication): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 18;
  const CW = W - M * 2;

  // ── Header ──────────────────────────────────────────────────────────────
  doc.setFillColor(26, 86, 219);
  doc.rect(0, 0, W, 42, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text("Knowledge Consortium of Gujarat University", M, 16);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text("Admission Portal · Official Payment Receipt", M, 24);
  doc.text("admission@kcg.edu.in  ·  www.kcg.edu.in", M, 30);

  // badge top-right
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(W - M - 28, 10, 28, 12, 2, 2, "F");
  doc.setTextColor(26, 86, 219);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("RECEIPT", W - M - 14, 17.5, { align: "center" });

  // ── Application ID row ──────────────────────────────────────────────────
  let y = 52;
  doc.setTextColor(26, 86, 219);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(app.id, M, y);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Submitted on ${fmt(app.submittedAt)}`, M, y + 7);

  // status pill
  const sText = "PAYMENT COMPLETED";
  doc.setFillColor(34, 197, 94);
  const sw = doc.getTextWidth(sText) + 8;
  doc.roundedRect(W - M - sw, y - 8, sw, 10, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text(sText, W - M - sw / 2, y - 2.5, { align: "center" });

  y += 18;

  // ── Payment summary box ─────────────────────────────────────────────────
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(M, y, CW, 28, 3, 3, "F");

  const cols = [
    { label: "Transaction ID", value: app.transactionId },
    { label: "Payment Method", value: app.paymentMethod.toUpperCase() },
    {
      label: "Fee Amount",
      value: `INR ${app.feeAmount.toLocaleString("en-IN")}`,
    },
    { label: "Payment Date", value: fmt(app.paymentDate) },
  ];
  const cw = CW / 4;
  cols.forEach((c, i) => {
    const cx = M + i * cw + 4;
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(c.label, cx, y + 9);
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text(c.value, cx, y + 18);
  });

  y += 36;

  // ── Two-column: Student | Program ──────────────────────────────────────
  const half = (CW - 4) / 2;
  const boxH = 62;

  // student box
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(M, y, half, boxH, 3, 3, "F");
  doc.setTextColor(26, 86, 219);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text("STUDENT DETAILS", M + 4, y + 9);

  const studentRows: [string, string][] = [
    ["Full Name", app.name],
    ["Email", app.email],
    ["Phone", app.phone],
    ["Date of Birth", app.dateOfBirth],
    ["Gender", app.gender],
    ["Guardian", app.guardianName],
  ];
  studentRows.forEach(([lbl, val], i) => {
    const ry = y + 17 + i * 7.2;
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.text(lbl, M + 4, ry);
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(7.5);
    doc.text(val, M + 26, ry);
  });

  // program box
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(M + half + 4, y, half, boxH, 3, 3, "F");
  doc.setTextColor(26, 86, 219);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text("PROGRAM DETAILS", M + half + 8, y + 9);

  const programRows: [string, string][] = [
    ["Program", app.program],
    ["10th Marks", `${app.tenthMarks}%`],
    ["12th Marks", `${app.twelfthMarks}%`],
    ["Previous Institution", app.previousInstitution],
    ["Entrance Score", String(app.entranceExamScore ?? "—")],
    ["Application Status", app.status],
  ];
  programRows.forEach(([lbl, val], i) => {
    const ry = y + 17 + i * 7.2;
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.text(lbl, M + half + 8, ry);
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(7.5);
    const truncated = val.length > 22 ? val.slice(0, 20) + "…" : val;
    doc.text(truncated, M + half + 34, ry);
  });

  y += boxH + 8;

  // ── QR Code + Verification ─────────────────────────────────────────────
  const verificationCode = `KCG-${app.id}-${app.transactionId}`;

  let qrY = y;
  try {
    const qrDataUrl = await QRCode.toDataURL(verificationCode, {
      width: 100,
      margin: 1,
      color: { dark: "#000000", light: "#ffffff" },
    });
    doc.addImage(qrDataUrl, "PNG", M, qrY, 28, 28);
  } catch {
    doc.setFillColor(245, 247, 250);
    doc.rect(M, qrY, 28, 28, "F");
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(7);
    doc.text("QR", M + 14, qrY + 14, { align: "center" });
  }

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Verification Code", M + 33, qrY + 7);
  doc.setFont("courier", "bold");
  doc.setFontSize(9.5);
  doc.text(verificationCode, M + 33, qrY + 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "Scan QR or use the code above to verify authenticity at admission.kcg.edu.in",
    M + 33,
    qrY + 24,
  );

  y = qrY + 36;

  // ── Divider + Footer ──────────────────────────────────────────────────
  doc.setDrawColor(200, 200, 200);
  doc.line(M, y, W - M, y);
  y += 5;
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "This is a computer-generated receipt and does not require a physical signature.",
    W / 2,
    y,
    { align: "center" },
  );
  doc.text(
    `Generated on ${fmtTime(new Date().toISOString())} · KCG University Admission Portal`,
    W / 2,
    y + 5,
    { align: "center" },
  );

  doc.save(`KCG-Receipt-${app.id}.pdf`);
}
