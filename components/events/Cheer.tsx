import { numberFormat } from "~/helpers"

import EventCard from "../EventCard"

const Cheer = ({ event, ...rest }) => (
  <EventCard {...rest} event={event} icon="Diamond" description={<><strong>{numberFormat.format(event.data.bits)}</strong> bits</>}>
    {event.data.comment && (
      <blockquote>{event.data.comment}</blockquote>
    )}
  </EventCard>
)

export default Cheer
