import { numberFormat } from "~/helpers"

import EventCard from "../EventCard"

const Raid = ({ event, ...rest }) => (
  <EventCard {...rest} event={event} icon="Group" description={<>Started a raid with <strong>{numberFormat.format(event.data.viewerCount)}</strong> viewers</>} />
)

export default Raid
