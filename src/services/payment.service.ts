import type { PaymentMethodId, PaymentResult } from "@/models";
import { delay, uid } from "@/lib/async";

export const paymentService = {
  async pay(method: PaymentMethodId, amount: number): Promise<PaymentResult> {
    await delay(1400);
    // Cash always succeeds; mobile money has 15% simulated failure
    const failed = method !== "cash" && Math.random() < 0.15;
    if (failed) {
      return {
        status: "failed", method, amount,
        reference: uid("REF").toUpperCase(),
        message: "Paiement refusé par l'opérateur. Réessayez.",
      };
    }
    return {
      status: "success", method, amount,
      reference: uid("REF").toUpperCase(),
      message: "Paiement réussi.",
    };
  },
};
