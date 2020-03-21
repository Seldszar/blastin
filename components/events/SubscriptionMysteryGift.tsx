import clsx from "clsx"
import { useToggle } from "react-use"

import { getSubscriptionPlanName } from "~/helpers"

import EventCard from "../EventCard"

import styles from "./SubscriptionMysteryGift.module.scss"

const SubscriptionMysteryGift = ({ event, ...rest }) => {
  const [expanded, toggle] = useToggle(false)

  return (
    <EventCard {...rest} event={event} icon="TeamFavorite" description={<>Gifted <strong>{event.data.subscriptionCount}</strong> subscription to the community ({getSubscriptionPlanName(event.data.subscriptionPlan)})</>}>
      <div className={clsx(styles.wrapper, { [styles.expanded]: expanded })} onClick={event => event.stopPropagation()}>
        <div className={styles.toggleButton} onClick={toggle}>
          <span className={clsx(styles.icon, `ms-Icon ms-Icon--${expanded ? "CaretSolidDown" : "CaretSolidRight"}`)} />
          Recipients
        </div>

        {expanded && (
          <ul className={styles.recipients}>
            {event.data.recipients.map((recipient, index) => (
              <li key={index} className={styles.recipient}>{recipient.login}</li>
            ))}
          </ul>
        )}
      </div>
    </EventCard>
  )
}

export default SubscriptionMysteryGift
