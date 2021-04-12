import clsx from "clsx";
import PropTypes from "prop-types";
import { FunctionComponent, useMemo } from "react";
import { useMeasure, useToggle } from "react-use";

import { EventInstance } from "@/stores";

import styles from "./subscription-mystery-gift.module.scss";

export interface SubscriptionMysteryGiftProps {
  event: EventInstance;
}

const SubscriptionMysteryGift: FunctionComponent<SubscriptionMysteryGiftProps> = ({ event }) => {
  const [ref, { height }] = useMeasure<HTMLDivElement>();
  const [isExpanded, expand] = useToggle(false);

  const isCollapsed = useMemo(() => !isExpanded && height > 50, [height, isExpanded]);

  return (
    <div
      className={clsx(styles.wrapper, { [styles.collapsed]: isCollapsed })}
      onClick={(event) => event.stopPropagation()}
    >
      <div className={styles.inner}>
        <div ref={ref}>
          <ul className={styles.recipients}>
            {event.data.recipients.map((recipient: any) => (
              <li key={recipient.login} className={styles.recipient}>
                {recipient.login}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {isCollapsed && (
        <div className={styles.showMore}>
          <span onClick={() => expand()}>Show More</span>
        </div>
      )}
    </div>
  );
};

SubscriptionMysteryGift.propTypes = {
  event: PropTypes.any,
};

export default SubscriptionMysteryGift;
