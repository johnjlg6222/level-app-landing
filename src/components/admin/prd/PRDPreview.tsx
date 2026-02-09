'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common';

interface PRDPreviewProps {
  prdContent: string;
  projectName: string;
  clientCompany: string;
  onExportPDF: () => void;
  onExportMarkdown: () => void;
  onBack: () => void;
}

/**
 * Convert markdown to basic HTML for rendering
 */
function markdownToHtml(markdown: string): string {
  let html = markdown
    // Code blocks (must come before inline code)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-white/5 border border-white/10 rounded-lg p-4 overflow-x-auto my-3"><code>$2</code></pre>')
    // Headers
    .replace(/^#### (.+)$/gm, '<h4 class="text-base font-semibold text-white mt-6 mb-2">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-white mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-10 mb-4 pb-2 border-b border-white/10">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mt-10 mb-4">$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="text-white"><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-blue-400 text-sm">$1</code>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="text-gray-300 ml-4 list-disc">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="text-gray-300 ml-4 list-decimal">$1</li>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="border-white/10 my-6" />')
    // Paragraphs - wrap lines that aren't already HTML
    .replace(/^(?!<[hluop\d]|<hr|<pre|<li)(.+)$/gm, '<p class="text-gray-300 leading-relaxed mb-2">$1</p>');

  // Wrap consecutive li elements in ul/ol
  html = html.replace(
    /((?:<li class="text-gray-300 ml-4 list-disc">.*<\/li>\n?)+)/g,
    '<ul class="space-y-1 my-2">$1</ul>'
  );
  html = html.replace(
    /((?:<li class="text-gray-300 ml-4 list-decimal">.*<\/li>\n?)+)/g,
    '<ol class="space-y-1 my-2">$1</ol>'
  );

  return html;
}

export const PRDPreview: React.FC<PRDPreviewProps> = ({
  prdContent,
  projectName,
  clientCompany,
  onExportPDF,
  onExportMarkdown,
  onBack,
}) => {
  const renderedHtml = useMemo(() => markdownToHtml(prdContent), [prdContent]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">PRD - {projectName}</h2>
          <p className="text-sm text-gray-400">{clientCompany}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Retour au wizard
          </Button>
        </div>
      </div>

      {/* Export buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={onExportPDF}
          icon={<Download className="w-4 h-4" />}
        >
          Telecharger PDF
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onExportMarkdown}
          icon={<FileText className="w-4 h-4" />}
        >
          Telecharger Markdown
        </Button>
      </div>

      {/* Rendered PRD */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8">
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      </div>
    </motion.div>
  );
};
