import { CalculatorState } from './calculator';

// Lead status
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

// Lead submission data
export interface LeadSubmission {
  id?: string;
  created_at?: string;

  // Contact info
  email: string;
  name: string;
  phone: string;
  company: string | null;

  // Calculator selections
  screen_count: number;
  app_type: string;
  auth_level: string;
  payment_needs: string;
  additional_features: string[];
  design_style: string;
  has_branding: boolean;

  // Pricing
  estimated_price_min: number;
  estimated_price_max: number;

  // Booking
  booking_scheduled: boolean;
  booking_event_uri: string | null;
  booking_scheduled_time: string | null;

  // Meta
  status: LeadStatus;
  source: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

// Convert calculator state to lead submission
export function calculatorStateToLead(state: CalculatorState): Omit<LeadSubmission, 'id' | 'created_at'> {
  return {
    email: state.contact.email,
    name: state.contact.name,
    phone: state.contact.phone,
    company: state.contact.company || null,

    screen_count: state.screenCount,
    app_type: state.appType,
    auth_level: state.authLevel,
    payment_needs: state.paymentNeeds,
    additional_features: state.additionalFeatures,
    design_style: state.design.style,
    has_branding: state.design.hasBranding,

    estimated_price_min: state.calculatedPrice.min,
    estimated_price_max: state.calculatedPrice.max,

    booking_scheduled: state.booking.scheduled,
    booking_event_uri: state.booking.eventUri || null,
    booking_scheduled_time: state.booking.scheduledTime || null,

    status: 'new',
    source: 'calculator',
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
  };
}

// Quote data (for admin form)
export interface QuoteData {
  id?: string;
  created_at?: string;
  updated_at?: string;

  // Client info
  client_company: string;
  client_contact: string;
  client_email: string;
  client_phone: string;
  client_sector: string;

  // Project context
  project_name: string;
  problem_to_solve: string;
  project_type: string;
  target_users: string;

  // Features (JSON)
  simple_features: Record<string, unknown>;
  advanced_features: string[];
  selected_features: string[];

  // Plan & pricing
  selected_plan: string;
  selected_packs: string[];
  extra_screens: Record<string, number>;
  discount: number;

  // Design
  design_has_branding: boolean;
  design_style: string;
  design_primary_color: string;
  design_secondary_color: string;
  design_dark_mode: boolean;
  design_animations: boolean;

  // Logistics
  deadline: string;
  urgency: string;
  maintenance: string;

  // Notes
  notes_indispensable: string;
  notes_nice_to_have: string;
  notes_internal: string;

  // Calculated
  total_price: number;
  monthly_maintenance: number;

  // Status
  status: 'draft' | 'sent' | 'accepted' | 'rejected';

  // Generated content
  spec_markdown: string | null;
  prd_content: string | null;
}
