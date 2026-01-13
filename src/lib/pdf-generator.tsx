import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Font,
} from '@react-pdf/renderer';
import { QuoteFormState } from '@/hooks/useQuoteForm';
import { BASE_PLANS, PACKS, URGENCY_OPTIONS, MAINTENANCE_OPTIONS } from '@/types/pricing';
import { formatCurrency } from '@/utils/formatters';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1f2937',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
    paddingBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 10,
    color: '#6b7280',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1f2937',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3B82F6',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    width: '40%',
    color: '#6b7280',
  },
  value: {
    width: '60%',
    color: '#1f2937',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 8,
  },
  tableCell: {
    flex: 1,
  },
  tableCellRight: {
    flex: 1,
    textAlign: 'right',
  },
  totalSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#3B82F6',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: {
    color: '#6b7280',
  },
  totalValue: {
    fontWeight: 'bold',
    color: '#1f2937',
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  notes: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
  },
  noteText: {
    fontSize: 9,
    color: '#4b5563',
    lineHeight: 1.5,
  },
  badge: {
    backgroundColor: '#3B82F6',
    color: '#ffffff',
    padding: '4 8',
    borderRadius: 4,
    fontSize: 8,
    alignSelf: 'flex-start',
  },
});

// Quote PDF Document
interface QuotePDFProps {
  state: QuoteFormState;
  calculatedPrice: {
    subtotal: number;
    discount: number;
    urgencyMultiplier: number;
    total: number;
    monthlyMaintenance: number;
    breakdown: Array<{ label: string; amount: number }>;
  };
}

export function QuotePDFDocument({ state, calculatedPrice }: QuotePDFProps) {
  const plan = BASE_PLANS.find((p) => p.id === state.selectedPlan);
  const selectedPacks = PACKS.filter((p) => state.selectedPacks.includes(p.id));
  const urgency = URGENCY_OPTIONS.find((u) => u.id === state.logistics.urgency);
  const maintenance = MAINTENANCE_OPTIONS.find((m) => m.id === state.logistics.maintenance);

  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Level App</Text>
          <Text style={styles.tagline}>Developpement d'applications sur mesure</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Devis - {state.projectContext.projectName || 'Nouveau projet'}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Date :</Text>
          <Text style={styles.value}>{today}</Text>
        </View>

        {/* Client Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations Client</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Entreprise :</Text>
            <Text style={styles.value}>{state.clientInfo.company || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Contact :</Text>
            <Text style={styles.value}>{state.clientInfo.contact || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email :</Text>
            <Text style={styles.value}>{state.clientInfo.email || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Telephone :</Text>
            <Text style={styles.value}>{state.clientInfo.phone || '-'}</Text>
          </View>
        </View>

        {/* Project Context */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contexte du Projet</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Probleme a resoudre :</Text>
            <Text style={styles.value}>{state.projectContext.problemToSolve || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Type de projet :</Text>
            <Text style={styles.value}>{state.projectContext.projectType || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Utilisateurs cibles :</Text>
            <Text style={styles.value}>{state.projectContext.targetUsers || '-'}</Text>
          </View>
        </View>

        {/* Pricing Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detail du Devis</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCell}>Description</Text>
              <Text style={styles.tableCellRight}>Montant</Text>
            </View>

            {/* Plan */}
            {plan && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Plan {plan.name}</Text>
                <Text style={styles.tableCellRight}>{formatCurrency(plan.basePrice)}</Text>
              </View>
            )}

            {/* Packs */}
            {selectedPacks.map((pack) => (
              <View key={pack.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{pack.name}</Text>
                <Text style={styles.tableCellRight}>{formatCurrency(pack.price)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sous-total</Text>
            <Text style={styles.totalValue}>{formatCurrency(calculatedPrice.subtotal)}</Text>
          </View>

          {calculatedPrice.discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Remise ({state.discount}%)</Text>
              <Text style={{ ...styles.totalValue, color: '#10b981' }}>
                -{formatCurrency(calculatedPrice.discount)}
              </Text>
            </View>
          )}

          {calculatedPrice.urgencyMultiplier > 1 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Urgence ({urgency?.label}) x{calculatedPrice.urgencyMultiplier}
              </Text>
              <Text style={styles.totalValue}>Inclus</Text>
            </View>
          )}

          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>Total HT</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(calculatedPrice.total)}</Text>
          </View>

          {calculatedPrice.monthlyMaintenance > 0 && (
            <View style={{ ...styles.totalRow, marginTop: 10 }}>
              <Text style={styles.totalLabel}>Maintenance mensuelle ({maintenance?.label})</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(calculatedPrice.monthlyMaintenance)}/mois
              </Text>
            </View>
          )}
        </View>

        {/* Notes */}
        {state.notes.indispensable && (
          <View style={styles.notes}>
            <Text style={styles.sectionTitle}>Notes importantes</Text>
            <Text style={styles.noteText}>{state.notes.indispensable}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Level App - contact@level-app.fr - www.level-app.fr
          </Text>
          <Text>Devis valable 30 jours - TVA non applicable (art. 293 B du CGI)</Text>
        </View>
      </Page>
    </Document>
  );
}

// Generate PDF blob
export async function generateQuotePDF(
  state: QuoteFormState,
  calculatedPrice: QuotePDFProps['calculatedPrice']
): Promise<Blob> {
  const doc = <QuotePDFDocument state={state} calculatedPrice={calculatedPrice} />;
  const blob = await pdf(doc).toBlob();
  return blob;
}

// Download PDF
export async function downloadQuotePDF(
  state: QuoteFormState,
  calculatedPrice: QuotePDFProps['calculatedPrice'],
  filename?: string
): Promise<void> {
  const blob = await generateQuotePDF(state, calculatedPrice);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `devis-${state.projectContext.projectName || 'projet'}-${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Tech Spec PDF Document
export function TechSpecPDFDocument({ state }: { state: QuoteFormState }) {
  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Get enabled features
  const enabledFeatures = Object.entries(state.simpleFeatures)
    .filter(([_, value]) => value.enabled)
    .map(([key]) => key);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Level App</Text>
          <Text style={styles.tagline}>Specifications Techniques</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{state.projectContext.projectName || 'Nouveau projet'}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Date :</Text>
          <Text style={styles.value}>{today}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Client :</Text>
          <Text style={styles.value}>{state.clientInfo.company || '-'}</Text>
        </View>

        {/* Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vue d'ensemble</Text>
          <Text style={styles.noteText}>{state.projectContext.problemToSolve || '-'}</Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fonctionnalites</Text>
          {enabledFeatures.map((feature) => (
            <View key={feature} style={styles.row}>
              <Text style={styles.value}>- {feature}</Text>
            </View>
          ))}
          {state.advancedFeatures.map((feature) => (
            <View key={feature} style={styles.row}>
              <Text style={styles.value}>- {feature}</Text>
            </View>
          ))}
        </View>

        {/* Design */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Design</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Style :</Text>
            <Text style={styles.value}>{state.design.style}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Couleur principale :</Text>
            <Text style={styles.value}>{state.design.primaryColor}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Mode sombre :</Text>
            <Text style={styles.value}>{state.design.darkMode ? 'Oui' : 'Non'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Animations :</Text>
            <Text style={styles.value}>{state.design.animations ? 'Oui' : 'Non'}</Text>
          </View>
        </View>

        {/* Requirements */}
        {state.notes.indispensable && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exigences indispensables</Text>
            <Text style={styles.noteText}>{state.notes.indispensable}</Text>
          </View>
        )}

        {state.notes.niceToHave && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nice to have</Text>
            <Text style={styles.noteText}>{state.notes.niceToHave}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Level App - Specifications Techniques</Text>
          <Text>Document confidentiel - Ne pas diffuser</Text>
        </View>
      </Page>
    </Document>
  );
}

// Download Tech Spec PDF
export async function downloadTechSpecPDF(
  state: QuoteFormState,
  filename?: string
): Promise<void> {
  const doc = <TechSpecPDFDocument state={state} />;
  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `specs-${state.projectContext.projectName || 'projet'}-${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
