'use client';

import { useMemo } from 'react';
import { CalculatorState, CalculatedPrice } from '@/types/calculator';
import { calculatePrice, estimateDeliveryWeeks, getPriceRangeText } from '@/lib/pricing-config';

export interface UsePriceCalculationReturn {
  price: CalculatedPrice;
  priceRange: string;
  deliveryWeeks: number;
  deliveryText: string;
}

export function usePriceCalculation(state: CalculatorState): UsePriceCalculationReturn {
  const price = useMemo(() => calculatePrice(state), [state]);

  const priceRange = useMemo(() => getPriceRangeText(price.min, price.max), [price]);

  const deliveryWeeks = useMemo(() => estimateDeliveryWeeks(state), [state]);

  const deliveryText = useMemo(() => {
    if (deliveryWeeks === 1) return '1 semaine';
    return `${deliveryWeeks} semaines`;
  }, [deliveryWeeks]);

  return {
    price,
    priceRange,
    deliveryWeeks,
    deliveryText,
  };
}

export default usePriceCalculation;
