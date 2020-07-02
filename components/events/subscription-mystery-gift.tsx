import clsx from "clsx";
import PropTypes from "prop-types";
import { FunctionComponent } from "react";
import { useToggle } from "react-use";

import { EventInstance } from "stores";

import styles from "./subscription-mystery-gift.module.scss";

export interface SubscriptionMysteryGiftProps {
  event: EventInstance;
}

const SubscriptionMysteryGift: FunctionComponent<SubscriptionMysteryGiftProps> = ({ event }) => {
  const [expanded, toggle] = useToggle(false);

  return (
    <div
      className={clsx(styles.wrapper, { [styles.expanded]: expanded })}
      onClick={(event) => event.stopPropagation()}
    >
      <div className={styles.toggleButton} onClick={toggle}>
        <span
          className={clsx(
            styles.icon,
            `ms-Icon ms-Icon--${expanded ? "CaretSolidDown" : "CaretSolidRight"}`
          )}
        />
        Recipients
      </div>

      {expanded && (
        <ul className={styles.recipients}>
          {event.data.recipients.map((recipient: any) => (
            <li key={recipient.login} className={styles.recipient}>
              {recipient.login}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

SubscriptionMysteryGift.propTypes = {
  event: PropTypes.any,
};

export default SubscriptionMysteryGift;
