/**
 * ═══════════════════════════════════════════════════════════════
 *  مکتبہ کتاب — Google Drive Book Links
 *  AtwsQuranofficial — Wifaq ul Madaris Al-Salfia
 * ═══════════════════════════════════════════════════════════════
 *
 *  Google Drive سے لنک کیسے لگائیں:
 *  ──────────────────────────────────
 *  1. Google Drive میں PDF اپ لوڈ کریں
 *  2. File پر right-click → "Share" → "Anyone with link can view"
 *  3. Share link کاپی کریں:
 *     https://drive.google.com/file/d/FILE_ID_HERE/view?usp=sharing
 *  4. نیچے اسی format میں لگائیں:
 *
 *  viewUrl  = Google Drive embed (خود بخود ٹھیک ہو جاتا ہے)
 *  pdfUrl   = Google Drive ڈاؤن لوڈ (خود بخود ٹھیک ہو جاتا ہے)
 *
 *  مثال:
 *  "جمال القرآن": {
 *    driveId: "1abc123xyz...",        ← صرف File ID
 *  },
 *
 *  یا مکمل URL بھی دے سکتے ہیں:
 *  "جمال القرآن": {
 *    viewUrl: "https://drive.google.com/file/d/1abc123xyz/view",
 *    pdfUrl:  "https://drive.google.com/file/d/1abc123xyz/view",
 *  },
 * ═══════════════════════════════════════════════════════════════
 */

interface BookLink {
  driveId?: string;
  viewUrl?: string;
  pdfUrl?: string;
}

/**
 * کتاب کا نام (عربی) → Google Drive لنکس
 * ─────────────────────────────────────────
 * نیچے اپنی کتابوں کے لنکس شامل کریں
 */
const BOOK_LINKS: Record<string, BookLink> = {
  // ══════════════════════════════
  //  بنین — لڑکوں کا نصاب
  // ══════════════════════════════

  // ─── اولیٰ (Grade 1) ───
  // "جمال القرآن":           { driveId: "لنک یہاں" },
  // "حفظ عم پارہ":            { driveId: "لنک یہاں" },
  // "الفقہ المیسر":           { driveId: "لنک یہاں" },
  // "نحو میر فارسی":          { driveId: "لنک یہاں" },
  // "النحو الیسر":            { driveId: "لنک یہاں" },
  // "ارشاد الصرف":            { driveId: "لنک یہاں" },

  // ─── ثانیہ (Grade 2) ───
  // "زاد الطالبین":           { driveId: "لنک یہاں" },
  // "ہدایۃ النحو":             { driveId: "لنک یہاں" },
  // "مختصر القدوری":          { driveId: "لنک یہاں" },

  // ─── دورہ حدیث ───
  // "صحیح البخاری (جلد اول)": { driveId: "لنک یہاں" },
  // "صحیح مسلم (جلد اول)":    { driveId: "لنک یہاں" },
  // "سنن الترمذی (جلد اول)":  { driveId: "لنک یہاں" },

  // ══════════════════════════════
  //  بنات — لڑکیوں کا نصاب
  // ══════════════════════════════

  // ─── خاصہ اول ───
  // "معلم الطالبین":           { driveId: "لنک یہاں" },
  // "خلاصۃ التجوید":           { driveId: "لنک یہاں" },

  // ─── عالمیہ دوم ───
  // "صحیح البخاری (جلد اول و دوم)": { driveId: "لنک یہاں" },
};

// ════════════════════════════════════════════════════════════════
//  نیچے والا کوڈ خود بخود کام کرتا ہے — تبدیل نہ کریں
// ════════════════════════════════════════════════════════════════

function driveViewUrl(id: string) {
  return `https://drive.google.com/file/d/${id}/preview`;
}

function drivePdfUrl(id: string) {
  return `https://drive.google.com/uc?export=download&id=${id}`;
}

export function getBookLinks(nameAr?: string): { viewUrl?: string; pdfUrl?: string } {
  if (!nameAr) return {};
  const entry = BOOK_LINKS[nameAr];
  if (!entry) return {};

  let viewUrl = entry.viewUrl;
  let pdfUrl = entry.pdfUrl;

  if (entry.driveId) {
    viewUrl = viewUrl ?? driveViewUrl(entry.driveId);
    pdfUrl = pdfUrl ?? drivePdfUrl(entry.driveId);
  }

  return { viewUrl, pdfUrl };
}
