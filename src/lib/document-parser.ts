// Document parsing utilities for knowledge base uploads
// Supports: PDF, Word (DOCX), CSV, TXT, Markdown

import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import Papa from 'papaparse';

export interface ParsedDocument {
  text: string;
  metadata?: {
    pages?: number;
    words?: number;
    title?: string;
  };
}

export interface ParseError {
  success: false;
  error: string;
}

export type ParseResult = { success: true; data: ParsedDocument } | ParseError;

/**
 * Parse a PDF file and extract text content
 */
export async function parsePDF(buffer: Buffer): Promise<ParseResult> {
  try {
    const data = await pdf(buffer);

    return {
      success: true,
      data: {
        text: data.text.trim(),
        metadata: {
          pages: data.numpages,
          words: data.text.split(/\s+/).length,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Erreur lors de l'extraction du PDF: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
    };
  }
}

/**
 * Parse a Word document (DOCX) and extract text content
 */
export async function parseWord(buffer: Buffer): Promise<ParseResult> {
  try {
    const result = await mammoth.extractRawText({ buffer });

    if (result.messages.length > 0) {
      console.warn('Word parsing warnings:', result.messages);
    }

    return {
      success: true,
      data: {
        text: result.value.trim(),
        metadata: {
          words: result.value.split(/\s+/).length,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Erreur lors de l'extraction du document Word: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
    };
  }
}

/**
 * Parse a CSV file and convert to readable text format
 */
export async function parseCSV(content: string): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          resolve({
            success: false,
            error: `Erreur lors de l'analyse du CSV: ${results.errors[0].message}`,
          });
          return;
        }

        // Convert CSV data to readable text format
        const headers = results.meta.fields || [];
        const rows = results.data as Record<string, string>[];

        let text = '';

        // Add headers
        if (headers.length > 0) {
          text += `Colonnes: ${headers.join(', ')}\n\n`;
        }

        // Format each row
        rows.forEach((row, index) => {
          text += `--- Ligne ${index + 1} ---\n`;
          headers.forEach((header) => {
            if (row[header]) {
              text += `${header}: ${row[header]}\n`;
            }
          });
          text += '\n';
        });

        resolve({
          success: true,
          data: {
            text: text.trim(),
            metadata: {
              words: text.split(/\s+/).length,
            },
          },
        });
      },
      error: (error) => {
        resolve({
          success: false,
          error: `Erreur lors de l'analyse du CSV: ${error.message}`,
        });
      },
    });
  });
}

/**
 * Parse a plain text or Markdown file
 */
export function parseText(content: string): ParseResult {
  return {
    success: true,
    data: {
      text: content.trim(),
      metadata: {
        words: content.split(/\s+/).length,
      },
    },
  };
}

/**
 * Parse Excel file (XLSX) - convert to CSV first using a simpler approach
 */
export async function parseExcel(buffer: Buffer): Promise<ParseResult> {
  // For Excel files, we'll try to extract basic text content
  // A full Excel parser would require xlsx library, but for simplicity
  // we recommend users export to CSV instead
  return {
    success: false,
    error: 'Les fichiers Excel (.xlsx) doivent etre convertis en CSV avant l\'import. Veuillez exporter votre fichier en format CSV.',
  };
}

/**
 * Main parser function - determines file type and parses accordingly
 */
export async function parseDocument(
  buffer: Buffer,
  mimeType: string,
  filename: string
): Promise<ParseResult> {
  // Determine file type from MIME type or extension
  const extension = filename.split('.').pop()?.toLowerCase();

  // PDF
  if (mimeType === 'application/pdf' || extension === 'pdf') {
    return parsePDF(buffer);
  }

  // Word documents
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    extension === 'docx'
  ) {
    return parseWord(buffer);
  }

  // Old Word format (DOC) - not supported
  if (mimeType === 'application/msword' || extension === 'doc') {
    return {
      success: false,
      error: 'Les fichiers .doc ne sont pas supportes. Veuillez convertir en .docx ou PDF.',
    };
  }

  // CSV files
  if (mimeType === 'text/csv' || extension === 'csv') {
    const content = buffer.toString('utf-8');
    return parseCSV(content);
  }

  // Excel files
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimeType === 'application/vnd.ms-excel' ||
    extension === 'xlsx' ||
    extension === 'xls'
  ) {
    return parseExcel(buffer);
  }

  // Plain text and Markdown
  if (
    mimeType === 'text/plain' ||
    mimeType === 'text/markdown' ||
    extension === 'txt' ||
    extension === 'md'
  ) {
    const content = buffer.toString('utf-8');
    return parseText(content);
  }

  return {
    success: false,
    error: `Type de fichier non supporte: ${mimeType || extension}`,
  };
}

/**
 * Get supported MIME types
 */
export const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'text/plain',
  'text/csv',
  'text/markdown',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/**
 * Get supported file extensions
 */
export const SUPPORTED_EXTENSIONS = ['.pdf', '.txt', '.csv', '.md', '.docx'];

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Validate file before parsing
 */
export function validateFile(
  file: { size: number; type: string; name: string },
  maxSize: number = 10 * 1024 * 1024 // 10MB default
): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Le fichier est trop volumineux. Taille maximum: ${formatFileSize(maxSize)}`,
    };
  }

  // Check file type
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  const isValidType = SUPPORTED_MIME_TYPES.includes(file.type) ||
                      SUPPORTED_EXTENSIONS.includes(extension);

  if (!isValidType) {
    return {
      valid: false,
      error: `Type de fichier non supporte. Formats acceptes: ${SUPPORTED_EXTENSIONS.join(', ')}`,
    };
  }

  return { valid: true };
}
