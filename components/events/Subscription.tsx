import { getSubscriptionPlanName } from "~/helpers"

import EventCard from "../EventCard"

const Subscription = ({ event, ...rest }) => (
  <EventCard {...rest} event={event} icon="FavoriteStar" description={<>New subscription ({getSubscriptionPlanName(event.data.subscriptionPlan)})</>} />
)

export default Subscription
