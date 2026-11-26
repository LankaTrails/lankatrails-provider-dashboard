import api from "@/api/axiosInstance";
import { toApiError } from "@/lib/apiError";

export interface StripeAccountStatus {
  account_id: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
}

/** Creates the Stripe Connect Express account on first use and returns a fresh onboarding link. */
export async function createOnboardingLink(): Promise<string> {
  try {
    const response = await api.post("/provider/onboarding/create-account");
    return response.data.url as string;
  } catch (error) {
    throw toApiError(error, "Could not start payment setup");
  }
}

/** Current state of the provider's Stripe account; null when none has been created yet (409). */
export async function getAccountStatus(): Promise<StripeAccountStatus | null> {
  try {
    const response = await api.get("/provider/onboarding/account-status");
    return response.data as StripeAccountStatus;
  } catch (error) {
    const apiError = toApiError(error, "Could not load payment status");
    if (apiError.status === 409) return null;
    throw apiError;
  }
}
