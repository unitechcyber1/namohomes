import React, { useMemo, useState } from "react";
import Icon from "../../../components/AppIcon";

const isHtml = (str) => {
  if (!str || typeof str !== "string") return false;
  return /<[a-z][\s\S]*>/i.test(str);
};

const parsePlainList = (text) => {
  if (!text || typeof text !== "string") return null;
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return null;

  const cleaned = lines.map((l) =>
    l.replace(/^(\u2022|\*|-)\s+/, "").replace(/^\d+[\.\)]\s+/, "")
  );

  const looksLikeList = lines.every((l) =>
    /^(\u2022|\*|-)\s+/.test(l) || /^\d+[\.\)]\s+/.test(l)
  );
  if (!looksLikeList) return null;

  return cleaned.filter(Boolean);
};

const isEffectivelyEmpty = (str) => {
  if (!str || typeof str !== "string") return true;
  const trimmed = str.trim();
  if (!trimmed) return true;
  if (trimmed === "<p></p>" || trimmed === "<p></p>\n") return true;
  return false;
};

function ProjectHighlights({ highlights, name }) {
  const [expanded, setExpanded] = useState(false);

  const content = useMemo(() => {
    if (!highlights) return null;
    if (typeof highlights !== "string") return String(highlights);
    return highlights;
  }, [highlights]);

  if (isEffectivelyEmpty(content)) return null;

  const hasToggle = (content?.length ?? 0) > 500;

  const asPlainList = !isHtml(content) ? parsePlainList(content) : null;

  const highlightsContent = isHtml(content) ? (
    <div
      className="prose prose-sm md:prose-base max-w-none prose-headings:text-text-primary prose-p:text-text-primary prose-li:text-text-primary prose-strong:text-text-primary prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-5 prose-ol:pl-5 prose-ul:[list-style-image:none] prose-ul:[list-style-type:disc] prose-ol:[list-style-image:none]"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  ) : asPlainList ? (
    <ul className="list-disc pl-5 space-y-2 text-text-primary">
      {asPlainList.map((item, idx) => (
        <li key={idx} className="leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  ) : (
    <div className="text-text-primary whitespace-pre-line leading-relaxed">
      {content}
    </div>
  );

  return (
    <section className="mt-8">
      <hr className="border-border mb-8" />

      <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-4">
        {name || "Project"} Highlights
      </h2>

      <div className="relative">
        <div
          className={`overflow-hidden transition-[max-height] duration-300 ease-out ${
            expanded ? "max-h-none" : "max-h-56"
          }`}
        >
          {highlightsContent}
        </div>

        {!expanded && hasToggle && (
          <div
            className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none"
            aria-hidden
          />
        )}

        {hasToggle && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-700 transition-colors"
          >
            <span>{expanded ? "See Less" : "See More"}</span>
            <Icon name="ChevronDown" size={16} className={expanded ? "rotate-180" : ""} />
          </button>
        )}
      </div>
    </section>
  );
}

export default ProjectHighlights;

