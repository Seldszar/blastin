import EventCard from "../EventCard"

const Ritual = ({ event, ...rest }) => (
  <EventCard {...rest} event={event} icon="AddFriend" description={<>New viewer ritual</>} />
)

export default Ritual
