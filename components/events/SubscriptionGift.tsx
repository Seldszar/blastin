import { getSubscriptionPlanName } from "~/helpers"

import EventCard from "../EventCard"

const SubscriptionGift = ({ event, ...rest }) => (
  <EventCard {...rest} event={event} icon="GiftboxOpen" description={<>Gifted a subscription to <strong>{event.data.recipient.login}</strong> ({getSubscriptionPlanName(event.data.subscriptionPlan)})</>} />
)

export default SubscriptionGift
