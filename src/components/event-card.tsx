import clsx from "clsx";
import PropTypes from "prop-types";
import { FunctionComponent, MouseEventHandler, ReactNode } from "react";

import { timeFormat } from "@/helpers";
import { EventInstance } from "@/stores";

import Icon from "./icon";

import styles from "./event-card.module.scss";

export interface EventCardProps {
  children?: ReactNode;
  className?: string;
  description: ReactNode;
  event: EventInstance;
  icon: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  small?: boolean;
  withEventValues?: boolean;
}

const EventCard: FunctionComponent<EventCardProps> = ({
  children,
  className,
  description,
  icon,
  event,
  onClick,
  small,
  withEventValues,
}) => (
  <div
    className={clsx(
      styles.wrapper,
      { [styles.interactive]: onClick, [styles.small]: small },
      className
    )}
    onClick={onClick}
  >
    <div className={styles.icon}>
      <Icon name={icon} />
    </div>

    <div className={styles.inner}>
      <div className={styles.level}>
        <div className={styles.left}>
          <div className={styles.user}>{event.user.login}</div>
          <div className={styles.message}>{description}</div>
        </div>

        <div className={styles.date}>{timeFormat.format(event.date)}</div>
      </div>

      {children && <div className={styles.body}>{children}</div>}
      {withEventValues && (
        <div className={styles.eventValues}>
          {event.eventValues.map(([key, value]) => (
            <dl key={key}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </dl>
          ))}
        </div>
      )}
    </div>
  </div>
);

EventCard.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  description: PropTypes.node.isRequired,
  event: PropTypes.any.isRequired,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  small: PropTypes.bool,
  withEventValues: PropTypes.bool,
};

export default EventCard;
