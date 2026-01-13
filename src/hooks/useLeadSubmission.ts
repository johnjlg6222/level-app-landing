'use client';

import { useState, useCallback } from 'react';
import { CalculatorState, calculatorStateToLead } from '@/types';
import { leadsService } from '@/lib/supabase';

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
      const { data, error: submitError } = await leadsService.create(leadData);

      if (submitError) {
        throw submitError;
      }

      if (data?.id) {
        setLeadId(data.id);
        return data.id;
      }

      return null;
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
      id: string,
      bookingData: {
        scheduled: boolean;
        eventUri?: string;
        scheduledTime?: string;
      }
    ): Promise<boolean> => {
      try {
        const { error: updateError } = await leadsService.updateBooking(id, {
          booking_scheduled: bookingData.scheduled,
          booking_event_uri: bookingData.eventUri,
          booking_scheduled_time: bookingData.scheduledTime,
        });

        if (updateError) {
          throw updateError;
        }

        return true;
      } catch (err) {
        console.error('Booking update error:', err);
        return false;
      }
    },
    []
  );

  const sendConfirmationEmail = useCallback(async (id: string): Promise<boolean> => {
    try {
      // This would typically call a serverless function or API route
      // to send the email via a service like SendGrid, Resend, etc.
      console.log('Sending confirmation email for lead:', id);

      // For now, just return true as a placeholder
      // In production, you'd call an API endpoint here
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
