import { ReactNode } from "react";

import { numberFormat, getSubscriptionPlanName } from "lib/helpers";
import { EventInstance } from "stores";

import SubscriptionMysteryGift from "components/events/subscription-mystery-gift";

export const HOSTING_PATTERN = /^(\w+) is now(?: (auto))? hosting\D+(\d+)?/i;

export enum EventType {
  AnonymousSubscriptionGift = "anonsubgift",
  BitsBadgeTier = "bitsbadgetier",
  Cheer = "cheer",
  GiftPaidUpgrade = "giftpaidupgrade",
  Host = "host",
  Raid = "raid",
  Resubscription = "resub",
  Ritual = "ritual",
  Subscription = "sub",
  SubscriptionGift = "subgift",
  SubscriptionMysteryGift = "submysterygift",
}

export interface EventDescriptor {
  icon: string;
  description: (event: EventInstance) => ReactNode;
  content?: (event: EventInstance) => ReactNode;
}

export const eventRegistry = new Map<EventType, EventDescriptor>([
  [
    EventType.AnonymousSubscriptionGift,
    {
      icon: "GiftboxOpen",
      description(event) {
        return (
          <>
            Gifted a subscription to <strong>{event.data.recipient.login}</strong> (
            {getSubscriptionPlanName(event.data.subscriptionPlan)})
          </>
        );
      },
    },
  ],
  [
    EventType.BitsBadgeTier,
    {
      icon: "DoubleChevronUp",
      description(event) {
        return (
          <>
            Received the <strong>{numberFormat.format(event.data.threshold)}</strong> bits tier
            badge
          </>
        );
      },
    },
  ],
  [
    EventType.Cheer,
    {
      icon: "Diamond",
      description(event) {
        return (
          <>
            <strong>{numberFormat.format(event.data.bits)}</strong> bits
          </>
        );
      },
    },
  ],
  [
    EventType.GiftPaidUpgrade,
    {
      icon: "CPlusPlusLanguage",
      description(event) {
        return (
          <>
            Upgraded his subscription gifted by <strong>{event.data.sender.name}</strong>
          </>
        );
      },
    },
  ],
  [
    EventType.Raid,
    {
      icon: "Group",
      description(event) {
        return (
          <>
            Started a raid with <strong>{numberFormat.format(event.data.viewerCount)}</strong>{" "}
            viewers
          </>
        );
      },
    },
  ],
  [
    EventType.Resubscription,
    {
      icon: "FavoriteStar",
      description(event) {
        return (
          <>
            <strong>{event.data.cumulativeMonths}</strong> months (
            {getSubscriptionPlanName(event.data.subscriptionPlan)})
          </>
        );
      },
    },
  ],
  [
    EventType.Ritual,
    {
      icon: "AddFriend",
      description() {
        return <>New viewer ritual</>;
      },
    },
  ],
  [
    EventType.Subscription,
    {
      icon: "FavoriteStar",
      description(event) {
        return <>New subscription ({getSubscriptionPlanName(event.data.subscriptionPlan)})</>;
      },
    },
  ],
  [
    EventType.SubscriptionGift,
    {
      icon: "GiftboxOpen",
      description(event) {
        return (
          <>
            Gifted a subscription to <strong>{event.data.recipient.login}</strong> (
            {getSubscriptionPlanName(event.data.subscriptionPlan)})
          </>
        );
      },
    },
  ],
  [
    EventType.SubscriptionMysteryGift,
    {
      icon: "TeamFavorite",
      description(event) {
        return (
          <>
            Gifted <strong>{event.data.subscriptionCount}</strong> subscription to the community (
            {getSubscriptionPlanName(event.data.subscriptionPlan)})
          </>
        );
      },
      content(event) {
        return <SubscriptionMysteryGift event={event} />;
      },
    },
  ],
]);
