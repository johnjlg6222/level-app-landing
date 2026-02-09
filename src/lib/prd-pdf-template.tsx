import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';

// --- Styles ---
const colors = {
  primary: '#3B82F6',
  purple: '#8B5CF6',
  text: '#1f2937',
  textLight: '#6b7280',
  textMuted: '#9ca3af',
  bg: '#ffffff',
  bgLight: '#f9fafb',
  bgAccent: '#f3f4f6',
  border: '#e5e7eb',
  mustHave: '#EF4444',
  shouldHave: '#F97316',
  niceToHave: '#22C55E',
};

const styles = StyleSheet.create({
  // Page
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: colors.text,
  },
  coverPage: {
    padding: 40,
    fontFamily: 'Helvetica',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Cover
  coverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverBrand: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  coverTagline: {
    fontSize: 11,
    color: colors.textLight,
    marginBottom: 60,
  },
  coverTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 14,
    color: colors.purple,
    marginBottom: 40,
    textAlign: 'center',
  },
  coverMeta: {
    alignItems: 'center',
  },
  coverMetaRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  coverMetaLabel: {
    fontSize: 10,
    color: colors.textLight,
    width: 80,
  },
  coverMetaValue: {
    fontSize: 10,
    color: colors.text,
    fontWeight: 'bold',
  },

  // Headers
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerBrand: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  headerProject: {
    fontSize: 9,
    color: colors.textLight,
  },

  // TOC
  tocTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  tocItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    borderBottomStyle: 'dotted',
  },
  tocItemText: {
    fontSize: 11,
    color: colors.text,
  },
  tocItemPage: {
    fontSize: 11,
    color: colors.textLight,
  },

  // Sections
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 20,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  subsectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
    color: colors.text,
  },
  paragraph: {
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.6,
    marginBottom: 8,
  },
  paragraphMuted: {
    fontSize: 9,
    color: colors.textLight,
    lineHeight: 1.5,
    marginBottom: 6,
  },

  // Feature cards
  featureCard: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  featureCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.bgAccent,
  },
  featureCardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
  },
  featureCardBody: {
    padding: 10,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 8,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  // Lists
  listItem: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 8,
  },
  listBullet: {
    width: 12,
    fontSize: 10,
    color: colors.textLight,
  },
  listText: {
    flex: 1,
    fontSize: 9,
    color: colors.text,
    lineHeight: 1.5,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 8,
    color: colors.textMuted,
  },

  // Two column
  twoCol: {
    flexDirection: 'row',
    gap: 16,
  },
  col: {
    flex: 1,
  },
});

// --- Helpers ---

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'must_have':
      return colors.mustHave;
    case 'should_have':
      return colors.shouldHave;
    case 'nice_to_have':
      return colors.niceToHave;
    default:
      return colors.textLight;
  }
}

function getPriorityLabel(priority: string): string {
  switch (priority) {
    case 'must_have':
      return 'MUST HAVE';
    case 'should_have':
      return 'SHOULD HAVE';
    case 'nice_to_have':
      return 'NICE TO HAVE';
    default:
      return priority.toUpperCase();
  }
}

interface ParsedFeature {
  name: string;
  description: string;
  items: string[];
  priority: string;
}

// Helpers for flexible section matching
const SECTION_PATTERNS: Record<string, RegExp> = {
  overview: /vue\s*d|overview|contexte|introduction|aper[cç]u|objectif|pr[eé]sentation/i,
  personas: /persona|utilisateur|profil|cible|audience|user/i,
  features: /sp[eé]cification|fonctionnalit|feature|module|composant/i,
  design: /design|ux|interface|visuel|ergonomie|maquette/i,
  technical: /technique|technical|stack|architecture|technolog|approche/i,
  priority: /priorit|ordre|roadmap|planification|phase|planning/i,
  metrics: /m[eé]trique|succe|succ[eè]s|kpi|indicateur|mesure|objectif.*mesur/i,
};

function matchesSection(title: string, patternKey: string): boolean {
  const pattern = SECTION_PATTERNS[patternKey];
  return pattern ? pattern.test(title) : false;
}

function extractListItems(content: string): string[] {
  return content
    .split('\n')
    .filter((l) => /^\s*[-*]/.test(l) || /^\s*\d+[.)]\s/.test(l))
    .map((l) => l.replace(/^\s*[-*]\s*/, '').replace(/^\s*\d+[.)]\s*/, '').replace(/\*\*/g, '').trim())
    .filter(Boolean);
}

function stripMarkdown(text: string): string {
  return text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '').replace(/#{1,6}\s*/g, '').trim();
}

/**
 * Parse markdown PRD into structured sections for PDF rendering.
 * Uses flexible regex matching to handle varied AI output formats.
 */
function parsePRDMarkdown(markdown: string): {
  overview: string;
  personas: string[];
  features: ParsedFeature[];
  designDirection: string;
  technicalApproach: string;
  priorityOrder: string[];
  successMetrics: string[];
} {
  // Split on ## headers (level 2)
  const sections = markdown.split(/^## /gm).filter(Boolean);

  let overview = '';
  const personas: string[] = [];
  const features: ParsedFeature[] = [];
  let designDirection = '';
  let technicalApproach = '';
  const priorityOrder: string[] = [];
  const successMetrics: string[] = [];

  // Track which sections were matched to avoid double-matching
  const matched = new Set<string>();

  for (const section of sections) {
    const lines = section.split('\n');
    const title = lines[0]?.trim() || '';
    const titleLower = title.toLowerCase();
    const content = lines.slice(1).join('\n').trim();

    if (!matched.has('overview') && matchesSection(titleLower, 'overview')) {
      matched.add('overview');
      overview = stripMarkdown(content.split('\n').filter((l) => l.trim() && !/^[-*]/.test(l.trim())).slice(0, 6).join('\n'));
      // Also grab list items as part of overview if no separate text
      if (!overview) {
        overview = extractListItems(content).slice(0, 4).join('. ');
      }
    } else if (!matched.has('personas') && matchesSection(titleLower, 'personas')) {
      matched.add('personas');
      const items = extractListItems(content);
      personas.push(...(items.length > 0 ? items : content.split('\n').filter((l) => l.trim()).slice(0, 4).map(stripMarkdown)));
    } else if (!matched.has('design') && matchesSection(titleLower, 'design')) {
      matched.add('design');
      designDirection = stripMarkdown(content).substring(0, 1500);
    } else if (!matched.has('technical') && matchesSection(titleLower, 'technical')) {
      matched.add('technical');
      technicalApproach = stripMarkdown(content).substring(0, 1500);
    } else if (!matched.has('priority') && matchesSection(titleLower, 'priority')) {
      matched.add('priority');
      const items = extractListItems(content);
      priorityOrder.push(...(items.length > 0 ? items : content.split('\n').filter((l) => l.trim()).slice(0, 6).map(stripMarkdown)));
    } else if (!matched.has('metrics') && matchesSection(titleLower, 'metrics')) {
      matched.add('metrics');
      const items = extractListItems(content);
      successMetrics.push(...(items.length > 0 ? items : content.split('\n').filter((l) => l.trim()).slice(0, 6).map(stripMarkdown)));
    } else if (matchesSection(titleLower, 'features')) {
      matched.add('features');
      // Parse ### subsections for individual features
      const featureSections = content.split(/^### /gm).filter(Boolean);
      for (const fs of featureSections) {
        const fLines = fs.split('\n');
        const fName = stripMarkdown(fLines[0] || '');
        const fContent = fLines.slice(1).join('\n').trim();
        const fItems = extractListItems(fContent).slice(0, 10);

        let priority = 'should_have';
        const fLower = fContent.toLowerCase();
        if (fLower.includes('must_have') || fLower.includes('must have') || fLower.includes('indispensable') || fLower.includes('critique') || fLower.includes('obligatoire')) {
          priority = 'must_have';
        } else if (fLower.includes('nice_to_have') || fLower.includes('nice to have') || fLower.includes('optionnel') || fLower.includes('bonus')) {
          priority = 'nice_to_have';
        }

        if (fName) {
          features.push({
            name: fName,
            description: fContent
              .split('\n')
              .filter((l) => l.trim() && !/^\s*[-*]/.test(l) && !/^\s*\d+[.)]/.test(l) && !/^####/.test(l))
              .slice(0, 2)
              .map(stripMarkdown)
              .join(' '),
            items: fItems,
            priority,
          });
        }
      }

      // If no ### subsections found, try #### or bold-header patterns
      if (features.length === 0) {
        const altSections = content.split(/^####\s+/gm).filter(Boolean);
        for (const fs of altSections) {
          const fLines = fs.split('\n');
          const fName = stripMarkdown(fLines[0] || '');
          const fContent = fLines.slice(1).join('\n').trim();
          const fItems = extractListItems(fContent).slice(0, 10);
          if (fName && fItems.length > 0) {
            features.push({
              name: fName,
              description: '',
              items: fItems,
              priority: 'should_have',
            });
          }
        }
      }
    }
  }

  // Fallback: if no features found, try to extract any ### headers from the whole document
  if (features.length === 0) {
    const h3Sections = markdown.split(/^### /gm).filter(Boolean).slice(1); // skip first (before any ###)
    for (const fs of h3Sections.slice(0, 8)) {
      const fLines = fs.split('\n');
      const fName = stripMarkdown(fLines[0] || '');
      const fContent = fLines.slice(1).join('\n').trim();
      const fItems = extractListItems(fContent).slice(0, 8);
      if (fName && fItems.length > 0) {
        features.push({
          name: fName,
          description: '',
          items: fItems,
          priority: 'should_have',
        });
      }
    }
  }

  return { overview, personas, features, designDirection, technicalApproach, priorityOrder, successMetrics };
}

// --- PDF Document Component ---

interface PRDPDFProps {
  prdContent: string;
  projectName: string;
  clientCompany: string;
}

export function PRDPDFDocument({ prdContent, projectName, clientCompany }: PRDPDFProps) {
  const parsed = parsePRDMarkdown(prdContent);
  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverContainer}>
          <Text style={styles.coverBrand}>Level App</Text>
          <Text style={styles.coverTagline}>Product Requirements Document</Text>

          <Text style={styles.coverTitle}>{projectName || 'Nouveau Projet'}</Text>
          <Text style={styles.coverSubtitle}>PRD - Specifications Fonctionnelles</Text>

          <View style={styles.coverMeta}>
            <View style={styles.coverMetaRow}>
              <Text style={styles.coverMetaLabel}>Client :</Text>
              <Text style={styles.coverMetaValue}>{clientCompany || '-'}</Text>
            </View>
            <View style={styles.coverMetaRow}>
              <Text style={styles.coverMetaLabel}>Date :</Text>
              <Text style={styles.coverMetaValue}>{today}</Text>
            </View>
            <View style={styles.coverMetaRow}>
              <Text style={styles.coverMetaLabel}>Version :</Text>
              <Text style={styles.coverMetaValue}>1.0</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Level App - contact@level-app.fr - www.level-app.fr</Text>
          <Text>Document confidentiel</Text>
        </View>
      </Page>

      {/* Table of Contents */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerBrand}>Level App</Text>
          <Text style={styles.headerProject}>{projectName}</Text>
        </View>

        <Text style={styles.tocTitle}>Table des matieres</Text>

        {[
          'Vue d\'ensemble du projet',
          'Personas utilisateurs',
          'Specifications des fonctionnalites',
          'Direction design & UX',
          'Approche technique',
          'Ordre de priorite',
          'Metriques de succes',
        ].map((item, i) => (
          <View key={i} style={styles.tocItem}>
            <Text style={styles.tocItemText}>
              {i + 1}. {item}
            </Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text>PRD - {projectName} - {today}</Text>
        </View>
      </Page>

      {/* Project Overview */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerBrand}>Level App</Text>
          <Text style={styles.headerProject}>{projectName}</Text>
        </View>

        <Text style={styles.sectionTitle}>1. Vue d'ensemble du projet</Text>
        <Text style={styles.paragraph}>
          {parsed.overview || 'Consultez le document markdown pour la description complete du projet.'}
        </Text>

        {/* Personas */}
        <Text style={styles.sectionTitle}>2. Personas utilisateurs</Text>
        {parsed.personas.length > 0 ? (
          parsed.personas.map((persona, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.listBullet}>•</Text>
              <Text style={styles.listText}>{persona}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.paragraphMuted}>Personas definis dans le document markdown complet.</Text>
        )}

        <View style={styles.footer}>
          <Text>PRD - {projectName} - {today}</Text>
        </View>
      </Page>

      {/* Feature Specifications */}
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <Text style={styles.headerBrand}>Level App</Text>
          <Text style={styles.headerProject}>{projectName}</Text>
        </View>

        <Text style={styles.sectionTitle}>3. Specifications des fonctionnalites</Text>

        {parsed.features.length > 0 ? (
          parsed.features.map((feature, i) => (
            <View key={i} style={styles.featureCard} wrap={false}>
              <View
                style={{
                  ...styles.featureCardHeader,
                  borderLeftWidth: 4,
                  borderLeftColor: getPriorityColor(feature.priority),
                }}
              >
                <Text style={styles.featureCardTitle}>{feature.name}</Text>
                <Text
                  style={{
                    ...styles.priorityBadge,
                    backgroundColor: getPriorityColor(feature.priority),
                  }}
                >
                  {getPriorityLabel(feature.priority)}
                </Text>
              </View>
              <View style={styles.featureCardBody}>
                {feature.description && (
                  <Text style={styles.paragraph}>{feature.description}</Text>
                )}
                {feature.items.map((item, j) => (
                  <View key={j} style={styles.listItem}>
                    <Text style={styles.listBullet}>•</Text>
                    <Text style={styles.listText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.paragraphMuted}>
            Les specifications detaillees sont disponibles dans le document markdown complet.
          </Text>
        )}

        <View style={styles.footer}>
          <Text>PRD - {projectName} - {today}</Text>
        </View>
      </Page>

      {/* Design & Technical */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerBrand}>Level App</Text>
          <Text style={styles.headerProject}>{projectName}</Text>
        </View>

        <Text style={styles.sectionTitle}>4. Direction Design & UX</Text>
        <Text style={styles.paragraph}>
          {parsed.designDirection || 'Consultez le document markdown pour les specifications design.'}
        </Text>

        <Text style={styles.sectionTitle}>5. Approche Technique</Text>
        <Text style={styles.paragraph}>
          {parsed.technicalApproach || 'Consultez le document markdown pour l\'approche technique.'}
        </Text>

        {/* Priority Order */}
        <Text style={styles.sectionTitle}>6. Ordre de priorite</Text>
        {parsed.priorityOrder.length > 0 ? (
          parsed.priorityOrder.map((item, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.listBullet}>{i + 1}.</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.paragraphMuted}>Voir le document markdown pour l'ordre de priorite.</Text>
        )}

        {/* Success Metrics */}
        <Text style={styles.sectionTitle}>7. Metriques de succes</Text>
        {parsed.successMetrics.length > 0 ? (
          parsed.successMetrics.map((metric, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.listBullet}>•</Text>
              <Text style={styles.listText}>{metric}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.paragraphMuted}>Voir le document markdown pour les metriques de succes.</Text>
        )}

        <View style={styles.footer}>
          <Text>PRD - {projectName} - {today}</Text>
        </View>
      </Page>
    </Document>
  );
}

// --- Export functions ---

/**
 * Generate PRD PDF blob
 */
export async function generatePRDPDF(
  prdContent: string,
  projectName: string,
  clientCompany: string
): Promise<Blob> {
  const doc = (
    <PRDPDFDocument
      prdContent={prdContent}
      projectName={projectName}
      clientCompany={clientCompany}
    />
  );
  const blob = await pdf(doc).toBlob();
  return blob;
}

/**
 * Download PRD as PDF
 */
export async function downloadPRDPDF(
  prdContent: string,
  projectName: string,
  clientCompany: string,
  filename?: string
): Promise<void> {
  const blob = await generatePRDPDF(prdContent, projectName, clientCompany);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `PRD-${projectName || 'projet'}-${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download PRD as Markdown file
 */
export function downloadPRDMarkdown(
  prdContent: string,
  projectName: string,
  filename?: string
): void {
  const blob = new Blob([prdContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `PRD-${projectName || 'projet'}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
