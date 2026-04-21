import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ArrowLeft, Maximize2, Minimize2, ExternalLink, BookOpen, Search, RefreshCw } from "lucide-react";

/** Google Drive یا عام URLs کو embed-friendly بناتا ہے */
function toEmbedUrl(url: string): string {
  if (!url) return "";

  // Google Drive: /view یا /edit → /preview
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (driveMatch) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }

  // Google Drive uc?id format
  const ucMatch = url.match(/drive\.google\.com\/uc\?.*id=([^&]+)/);
  if (ucMatch) {
    return `https://drive.google.com/file/d/${ucMatch[1]}/preview`;
  }

  // PDF files → Google Docs viewer
  if (url.toLowerCase().endsWith(".pdf")) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  }

  return url;
}

/** toDriveDownload — Google Drive ڈاؤن لوڈ URL */
function toDriveDownload(url: string): string {
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (driveMatch) {
    return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
  }
  return url;
}

export default function Reader() {
  const params = new URLSearchParams(window.location.search);
  const title = params.get("title") || "کتاب";
  const titleAr = params.get("ar") || title;
  const rawUrl = params.get("url") || "";

  const embedUrl = rawUrl ? toEmbedUrl(rawUrl) : "";
  const downloadUrl = rawUrl ? toDriveDownload(rawUrl) : "";
  const archiveSearch = `https://archive.org/search?query=${encodeURIComponent(titleAr)}&and[]=mediatype%3A"texts"`;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    document.title = `${titleAr} — مکتبہ آن لائن`;
  }, [titleAr]);

  // فل اسکرین toggle — Escape key سے بند ہو
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const containerClass = isFullscreen
    ? "fixed inset-0 z-50 flex flex-col bg-gray-950"
    : "min-h-screen flex flex-col bg-gray-950";

  return (
    <div className={containerClass}>
      {/* ── Top Bar ── */}
      <header className="flex items-center gap-3 px-4 py-2.5 bg-gray-900 border-b border-gray-800 shrink-0 min-w-0">
        {/* Back */}
        <Link href="/library">
          <button className="flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors text-sm whitespace-nowrap">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">مکتبہ</span>
          </button>
        </Link>

        <div className="w-px h-5 bg-gray-700 shrink-0" />

        {/* Book info */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate leading-tight" dir="rtl">{titleAr}</p>
            {title !== titleAr && <p className="text-xs text-gray-400 truncate">{title}</p>}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Reload */}
          <button
            onClick={() => setIframeKey(k => k + 1)}
            title="دوبارہ لوڈ کریں"
            className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Archive.org search */}
          <a
            href={archiveSearch}
            target="_blank"
            rel="noopener noreferrer"
            title="Archive.org پر تلاش کریں"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Archive</span>
          </a>

          {/* Download / Open externally */}
          {downloadUrl && (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="PDF ڈاؤن لوڈ"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-700 hover:bg-green-600 text-white text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF</span>
            </a>
          )}

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(f => !f)}
            title={isFullscreen ? "چھوٹا کریں (Esc)" : "فل اسکرین"}
            className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ── Viewer ── */}
      <main className="flex-1 relative bg-gray-900">
        {embedUrl ? (
          <iframe
            ref={iframeRef}
            key={iframeKey}
            src={embedUrl}
            className="absolute inset-0 w-full h-full border-0"
            allow="fullscreen autoplay"
            title={titleAr}
          />
        ) : (
          /* No URL — archive.org search */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-amber-400" />
            </div>
            <div dir="rtl">
              <p className="text-white text-xl font-bold mb-2">{titleAr}</p>
              <p className="text-gray-400 text-sm mb-6">یہ کتاب ابھی آن لائن دستیاب نہیں — عنقریب شامل کی جائے گی</p>
              <a
                href={archiveSearch}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors"
              >
                <Search className="w-4 h-4" />
                Archive.org پر تلاش کریں
              </a>
            </div>
          </div>
        )}
      </main>

      {/* ── Bottom hint (non-fullscreen only) ── */}
      {!isFullscreen && embedUrl && (
        <footer className="bg-gray-900 border-t border-gray-800 px-4 py-2 text-center shrink-0">
          <p className="text-xs text-gray-500" dir="rtl">
            کتاب نظر نہ آئے؟{" "}
            <button
              onClick={() => setIframeKey(k => k + 1)}
              className="text-green-400 hover:underline"
            >
              دوبارہ لوڈ کریں
            </button>
            {" "}یا{" "}
            <a href={archiveSearch} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
              Archive.org پر تلاش کریں
            </a>
            {" "}·{" "}
            <button onClick={() => setIsFullscreen(true)} className="text-blue-400 hover:underline">
              فل اسکرین (Esc سے بند)
            </button>
          </p>
        </footer>
      )}
    </div>
  );
}
