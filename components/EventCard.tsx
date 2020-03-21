import clsx from "clsx"
import { FunctionComponent, MouseEventHandler, ReactChild } from "react";

import { timeFormat } from "~/helpers";
import { EventInstance } from "~/stores";

import styles from "./EventCard.module.scss"

interface Props {
  className?: string;
  description: ReactChild;
  event: EventInstance;
  icon: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const EventCard: FunctionComponent<Props> = ({ children, className, description, icon, event, onClick }) => (
  <div className={clsx(styles.wrapper, { [styles.interactive]: onClick }, className)} onClick={onClick}>
    <div className={styles.icon}>
      <span className={clsx("ms-Icon", `ms-Icon--${icon}`)} />
    </div>

    <div className={styles.inner}>
      <div className={styles.level}>
        <div className={styles.left}>
          <div className={styles.user}>
            <span className={styles.userLogin}>{event.user.login}</span>
            {event.user.displayName && (
              <> <span className={styles.userDisplayName}>- {event.user.displayName}</span></>
            )}
          </div>

          <div className={styles.message}>
            {description}
          </div>
        </div>

        <div className={styles.date}>
          {timeFormat.format(event.date)}
        </div>
      </div>

      {children && (
        <div className={styles.body}>
          {children}
        </div>
      )}
    </div>
  </div>
)

export default EventCard
