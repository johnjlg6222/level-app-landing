import {
  CalculatorState,
  AUTH_OPTIONS,
  PAYMENT_OPTIONS,
  ADDITIONAL_FEATURES,
  DESIGN_STYLE_OPTIONS,
  APP_TYPE_OPTIONS,
  CalculatedPrice,
  PriceBreakdownItem,
} from '@/types/calculator';
import {
  BASE_PLANS,
  PACKS,
  URGENCY_OPTIONS,
  MAINTENANCE_OPTIONS,
  EXTRA_SCREEN_PRICES,
} from '@/types/pricing';

// Base price constants
const BASE_PRICE = 2000;
const PRICE_PER_SCREEN = 150;
const VARIANCE_PERCENTAGE = 0.15; // +/- 15% for min/max

/**
 * Calculate price from calculator state
 */
export function calculatePrice(state: CalculatorState): CalculatedPrice {
  const breakdown: PriceBreakdownItem[] = [];
  let total = BASE_PRICE;

  // Add base price
  breakdown.push({ label: 'Prix de base', amount: BASE_PRICE });

  // Screen count (beyond first 5)
  const extraScreens = Math.max(0, state.screenCount - 5);
  if (extraScreens > 0) {
    const screenCost = extraScreens * PRICE_PER_SCREEN;
    total += screenCost;
    breakdown.push({ label: `${extraScreens} écrans supplémentaires`, amount: screenCost });
  }

  // App type modifier
  const appType = APP_TYPE_OPTIONS.find((o) => o.id === state.appType);
  if (appType && appType.priceModifier !== 1) {
    const modifier = (appType.priceModifier - 1) * total;
    if (modifier !== 0) {
      total += modifier;
      breakdown.push({ label: appType.label, amount: modifier });
    }
  }

  // Auth level
  const auth = AUTH_OPTIONS.find((o) => o.id === state.authLevel);
  if (auth && auth.price > 0) {
    total += auth.price;
    breakdown.push({ label: auth.label, amount: auth.price });
  }

  // Payment needs
  const payment = PAYMENT_OPTIONS.find((o) => o.id === state.paymentNeeds);
  if (payment && payment.price > 0) {
    total += payment.price;
    breakdown.push({ label: payment.label, amount: payment.price });
  }

  // Additional features
  state.additionalFeatures.forEach((featureId) => {
    const feature = ADDITIONAL_FEATURES.find((f) => f.id === featureId);
    if (feature) {
      total += feature.price;
      breakdown.push({ label: feature.label, amount: feature.price });
    }
  });

  // Design style
  const designStyle = DESIGN_STYLE_OPTIONS.find((o) => o.id === state.design.style);
  if (designStyle && designStyle.priceModifier > 0) {
    total += designStyle.priceModifier;
    breakdown.push({ label: `Design ${designStyle.label}`, amount: designStyle.priceModifier });
  }

  // Calculate min/max with variance
  const variance = total * VARIANCE_PERCENTAGE;
  const min = Math.round(total - variance);
  const max = Math.round(total + variance);

  return {
    min,
    max,
    breakdown,
  };
}

/**
 * Calculate detailed quote price (for admin form)
 */
export function calculateQuotePrice(quoteState: {
  selectedPlan: string;
  selectedPacks: string[];
  selectedFeatures: string[];
  extraScreens: Record<string, number>;
  discount: number;
  urgency: string;
  maintenance: string;
}): {
  subtotal: number;
  discount: number;
  urgencyMultiplier: number;
  total: number;
  monthlyMaintenance: number;
  breakdown: PriceBreakdownItem[];
} {
  const breakdown: PriceBreakdownItem[] = [];
  let subtotal = 0;

  // Base plan
  const plan = BASE_PLANS.find((p) => p.id === quoteState.selectedPlan);
  if (plan) {
    subtotal += plan.basePrice;
    breakdown.push({ label: `Plan ${plan.name}`, amount: plan.basePrice });
  }

  // Packs
  quoteState.selectedPacks.forEach((packId) => {
    const pack = PACKS.find((p) => p.id === packId);
    if (pack) {
      subtotal += pack.price;
      breakdown.push({ label: pack.name, amount: pack.price });
    }
  });

  // Extra screens
  Object.entries(quoteState.extraScreens).forEach(([complexity, count]) => {
    if (count > 0) {
      const price = EXTRA_SCREEN_PRICES[complexity as keyof typeof EXTRA_SCREEN_PRICES] || 0;
      const screenCost = price * count;
      subtotal += screenCost;
      breakdown.push({ label: `${count} écrans ${complexity}`, amount: screenCost });
    }
  });

  // Apply discount
  const discountAmount = subtotal * (quoteState.discount / 100);
  const afterDiscount = subtotal - discountAmount;

  // Apply urgency multiplier
  const urgency = URGENCY_OPTIONS.find((u) => u.id === quoteState.urgency);
  const urgencyMultiplier = urgency?.multiplier || 1;
  const total = Math.round(afterDiscount * urgencyMultiplier);

  // Monthly maintenance
  const maintenance = MAINTENANCE_OPTIONS.find((m) => m.id === quoteState.maintenance);
  const monthlyMaintenance = maintenance?.monthlyPrice || 0;

  return {
    subtotal,
    discount: discountAmount,
    urgencyMultiplier,
    total,
    monthlyMaintenance,
    breakdown,
  };
}

/**
 * Get price range text
 */
export function getPriceRangeText(min: number, max: number): string {
  if (min === max) {
    return `${min.toLocaleString('fr-FR')} €`;
  }
  return `${min.toLocaleString('fr-FR')} € - ${max.toLocaleString('fr-FR')} €`;
}

/**
 * Estimate delivery time based on features
 */
export function estimateDeliveryWeeks(state: CalculatorState): number {
  let weeks = 4; // Base delivery time

  // Add time for complexity
  if (state.screenCount > 15) weeks += 1;
  if (state.screenCount > 25) weeks += 1;

  // Add time for features
  if (state.authLevel === 'multi_user') weeks += 1;
  if (state.paymentNeeds === 'both') weeks += 1;
  if (state.additionalFeatures.length > 3) weeks += 1;
  if (state.design.style === 'premium' || state.design.style === 'custom') weeks += 1;

  return Math.min(weeks, 10); // Cap at 10 weeks
}
