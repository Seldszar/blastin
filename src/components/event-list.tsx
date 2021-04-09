import { observer } from "mobx-react-lite";
import PropTypes from "prop-types";
import { useState, FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroller";

import { eventRegistry, EventType } from "@/constants";
import { EventInstance } from "@/stores";

import EventCard from "./event-card";

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

  const filteredEvents = events.slice(0, page * chunkCount);

  return (
    <InfiniteScroll
      hasMore={events.length > filteredEvents.length}
      loadMore={setPage}
      useWindow={false}
      threshold={0}
    >
      {filteredEvents.map((event) => {
        const eventHandler = eventRegistry.get(event.type as EventType);

        if (eventHandler === undefined) {
          return null;
        }

        return (
          <EventCard
            key={event.id}
            event={event}
            icon={eventHandler.icon}
            description={eventHandler.description(event)}
            onClick={onItemClick && (() => onItemClick(event))}
            small={small}
            withEventValues={withEventValues}
          >
            {eventHandler.content?.(event) ?? null}
          </EventCard>
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
