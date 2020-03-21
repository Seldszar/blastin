import EventCard from "../EventCard"

const GiftPaidUpgrade = ({ event, ...rest }) => (
  <EventCard {...rest} event={event} icon="CPlusPlusLanguage" description={<>Upgraded his subscription gifted by <strong>{event.data.sender.name}</strong></>} />
)

export default GiftPaidUpgrade
