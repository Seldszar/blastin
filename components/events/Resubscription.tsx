import { getSubscriptionPlanName } from "~/helpers"

import EventCard from "../EventCard"

const Resubscription = ({ event, ...rest }) => (
  <EventCard {...rest} event={event} icon="FavoriteStar" description={<><strong>{event.data.cumulativeMonths}</strong> months ({getSubscriptionPlanName(event.data.subscriptionPlan)})</>}>
    {event.data.comment && (
      <blockquote>{event.data.comment}</blockquote>
    )}
  </EventCard>
)

export default Resubscription
