'use client';

import { useState, useCallback } from 'react';
import { CalculatorState, calculatorStateToLead } from '@/types';
import { submitNetlifyForm } from '@/lib/netlify-forms';

export interface UseLeadSubmissionReturn {
  submitLead: (state: CalculatorState) => Promise<string | null>;
  updateBooking: (
    leadId: string,
    bookingData: {
      scheduled: boolean;
      eventUri?: string;
      scheduledTime?: string;
    }
  ) => Promise<boolean>;
  sendConfirmationEmail: (leadId: string) => Promise<boolean>;
  isSubmitting: boolean;
  leadId: string | null;
  error: string | null;
}

export function useLeadSubmission(): UseLeadSubmissionReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitLead = useCallback(async (state: CalculatorState): Promise<string | null> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const leadData = calculatorStateToLead(state);

      // Flatten to string values for Netlify Forms
      const formData: Record<string, string> = {
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        company: leadData.company || '',
        screen_count: String(leadData.screen_count),
        app_type: leadData.app_type,
        auth_level: leadData.auth_level,
        payment_needs: leadData.payment_needs,
        additional_features: leadData.additional_features.join(', '),
        design_style: leadData.design_style,
        has_branding: String(leadData.has_branding),
        estimated_price_min: String(leadData.estimated_price_min),
        estimated_price_max: String(leadData.estimated_price_max),
      };

      const result = await submitNetlifyForm('calculator-lead', formData);

      if (!result.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      // Generate a local UUID since we no longer have a DB-assigned ID
      const localId = crypto.randomUUID();
      setLeadId(localId);
      return localId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la soumission';
      setError(errorMessage);
      console.error('Lead submission error:', err);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateBooking = useCallback(
    async (
      _id: string,
      _bookingData: {
        scheduled: boolean;
        eventUri?: string;
        scheduledTime?: string;
      }
    ): Promise<boolean> => {
      // No-op: Netlify Forms are immutable; iClosed handles bookings separately
      return true;
    },
    []
  );

  const sendConfirmationEmail = useCallback(async (id: string): Promise<boolean> => {
    try {
      console.log('Sending confirmation email for lead:', id);
      return true;
    } catch (err) {
      console.error('Email sending error:', err);
      return false;
    }
  }, []);

  return {
    submitLead,
    updateBooking,
    sendConfirmationEmail,
    isSubmitting,
    leadId,
    error,
  };
}

export default useLeadSubmission;
