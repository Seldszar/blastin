import { numberFormat } from "~/helpers"

import EventCard from "../EventCard"

const BitsBadgeTier = ({ event, ...rest }) => (
  <EventCard {...rest} event={event} icon="DoubleChevronUp" description={<>Received the <strong>{numberFormat.format(event.data.threshold)}</strong> bits tier badge</>} />
)

export default BitsBadgeTier
