import { observer } from "mobx-react-lite";
import PropTypes from "prop-types";
import { useMemo, useState, FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroller";

import { eventRegistry, EventType } from "@/constants";
import { EventInstance } from "@/stores";

import EventCard from "./event-card";

import styles from "./event-list.module.scss";

export interface EventListProps {
  chunkCount?: number;
  events: EventInstance[];
  onItemClick?: (event: EventInstance) => void;
  small?: boolean;
  withEventValues?: boolean;
}

const EventList: FunctionComponent<EventListProps> = ({
  events,
  small,
  withEventValues,
  onItemClick,
  chunkCount = 25,
}) => {
  const [page, setPage] = useState(0);

  const filteredEvents = useMemo(() => events.slice(0, page * chunkCount), [
    events,
    chunkCount,
    page,
  ]);

  return (
    <InfiniteScroll
      hasMore={events.length > filteredEvents.length}
      loadMore={setPage}
      useWindow={false}
    >
      {filteredEvents.map((event) => {
        const eventHandler = eventRegistry.get(event.type as EventType);

        if (eventHandler === undefined) {
          return null;
        }

        return (
          <div key={event.id} className={styles.wrapper}>
            <EventCard
              event={event}
              icon={eventHandler.icon}
              description={eventHandler.description(event)}
              withEventValues={withEventValues}
              small={small}
              onClick={
                onItemClick && event.readState === "unread" ? () => onItemClick(event) : undefined
              }
            >
              {eventHandler.content?.(event) ?? null}
            </EventCard>
          </div>
        );
      })}
    </InfiniteScroll>
  );
};

EventList.propTypes = {
  chunkCount: PropTypes.number,
  events: PropTypes.array.isRequired,
  onItemClick: PropTypes.func,
  small: PropTypes.bool,
  withEventValues: PropTypes.bool,
};

export default observer(EventList);
