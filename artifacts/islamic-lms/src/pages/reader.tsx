import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Maximize2, Minimize2, ExternalLink, BookOpen, Search } from "lucide-react";

function useQuery() {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

export default function Reader() {
  const query = useQuery();
  const title = query.get("title") || "کتاب";
  const titleAr = query.get("ar") || title;
  const rawUrl = query.get("url") || "";
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const archiveSearch = `https://archive.org/search?query=${encodeURIComponent(titleAr || title)}&and[]=mediatype%3A"texts"`;
  const embedUrl = rawUrl
    ? rawUrl.endsWith(".pdf")
      ? `https://docs.google.com/viewer?url=${encodeURIComponent(rawUrl)}&embedded=true`
      : rawUrl
    : archiveSearch;

  useEffect(() => {
    document.title = `${titleAr} — مکتبہ آن لائن`;
  }, [titleAr]);

  return (
    <div className={`flex flex-col bg-gray-950 text-white ${isFullscreen ? "fixed inset-0 z-50" : "min-h-screen"}`}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900 border-b border-gray-800 gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/library">
            <button className="flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors text-sm shrink-0">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">مکتبہ کتاب</span>
            </button>
          </Link>
          <div className="w-px h-5 bg-gray-700 shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate" dir="rtl">{titleAr}</p>
              {title !== titleAr && <p className="text-xs text-gray-400 truncate">{title}</p>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={archiveSearch}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Archive.org</span>
          </a>
          {rawUrl && (
            <a
              href={rawUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-green-700 hover:bg-green-600 text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">نئی Tab</span>
            </a>
          )}
          <button
            onClick={() => setIsFullscreen(f => !f)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Iframe Viewer */}
      <div className="flex-1 relative bg-gray-900">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-950 z-10">
            <div className="w-12 h-12 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
            <p className="text-gray-400 text-sm" dir="rtl">کتاب لوڈ ہو رہی ہے...</p>
          </div>
        )}
        <iframe
          src={embedUrl}
          className="w-full h-full border-0"
          style={{ minHeight: isFullscreen ? "100vh" : "calc(100vh - 52px)" }}
          onLoad={() => setLoaded(true)}
          allow="fullscreen"
          title={titleAr}
        />
      </div>

      {/* Bottom hint */}
      {!isFullscreen && (
        <div className="bg-gray-900 border-t border-gray-800 px-4 py-2 text-center" dir="rtl">
          <p className="text-xs text-gray-500">
            اگر کتاب نظر نہ آئے تو{" "}
            <a href={archiveSearch} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
              Archive.org پر تلاش کریں
            </a>
            {" "}یا{" "}
            <button onClick={() => setIsFullscreen(true)} className="text-green-400 hover:underline">
              فل اسکرین
            </button>
            {" "}میں دیکھیں
          </p>
        </div>
      )}
    </div>
  );
}
