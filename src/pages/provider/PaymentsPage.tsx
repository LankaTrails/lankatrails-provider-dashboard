import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle, CreditCard, ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { createOnboardingLink, getAccountStatus, type StripeAccountStatus } from "@/services/onboarding";
import { errorMessage } from "@/lib/apiError";

/**
 * Stripe Connect Express onboarding.
 *  - default: status and a button to start or continue onboarding
 *  - "return": Stripe sends the provider back here after the hosted onboarding
 *  - "refresh": the onboarding link expired; a new one is requested straight away
 */
const PaymentsPage = ({ mode = "default" }: { mode?: "default" | "return" | "refresh" }) => {
  const [status, setStatus] = useState<StripeAccountStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startOnboarding = useCallback(async () => {
    setRedirecting(true);
    setError(null);
    try {
      window.location.assign(await createOnboardingLink());
    } catch (e) {
      setError(errorMessage(e, "Could not start payment setup"));
      setRedirecting(false);
    }
  }, []);

  useEffect(() => {
    if (mode === "refresh") {
      void startOnboarding();
      return;
    }
    getAccountStatus()
      .then(setStatus)
      .catch((e) => setError(errorMessage(e, "Could not load payment status")))
      .finally(() => setLoading(false));
  }, [mode, startOnboarding]);

  const ready = status?.details_submitted && status.charges_enabled && status.payouts_enabled;
  const checks = status
    ? [
        { label: "Details submitted", ok: status.details_submitted },
        { label: "Can accept payments", ok: status.charges_enabled },
        { label: "Payouts enabled", ok: status.payouts_enabled },
      ]
    : [];

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <div className="text-center">
        <CreditCard className="mx-auto mb-3 h-10 w-10 text-primary-500" />
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-gray-600">LankaTrails pays you through Stripe. Tourists can only book services from providers with payouts set up.</p>
      </div>

      {mode === "return" && !loading && !ready && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Thanks! Stripe may take a few minutes to verify your details.</AlertDescription>
        </Alert>
      )}
      {ready && (
        <Alert>
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>Your payment account is ready. Tourists can now book and pay for your services.</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Stripe Express account</CardTitle>
          <CardDescription>Onboarding happens on Stripe's secure site; you return here when you are done.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading || mode === "refresh" ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              {mode === "refresh" ? "Getting a fresh onboarding link..." : "Checking your payment account..."}
            </div>
          ) : (
            <>
              {status ? (
                <ul className="space-y-2">
                  {checks.map(({ label, ok }) => (
                    <li key={label} className="flex items-center justify-between rounded border p-3 text-sm">
                      {label}
                      {ok ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-amber-500" />}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">You have not started payment setup yet.</p>
              )}
              {!ready && (
                <Button onClick={startOnboarding} disabled={redirecting} className="w-full">
                  {redirecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
                  {status ? "Continue on Stripe" : "Set up payments with Stripe"}
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsPage;
