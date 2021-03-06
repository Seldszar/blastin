import { Parser } from "expr-eval";

export const numberFormat = new Intl.NumberFormat("en-US");
export const timeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "numeric",
});

export const queryParser = new Parser({
  operators: {
    assignment: false,
    concatenate: false,
    conditional: false,
  },
});

export function getSubscriptionPlanName(subscriptionPlan: string): string {
  switch (subscriptionPlan) {
    case "1000":
      return "Tier 1";

    case "2000":
      return "Tier 2";

    case "3000":
      return "Tier 3";

    case "Prime":
      return "Twitch Prime";

    default:
      return subscriptionPlan;
  }
}
