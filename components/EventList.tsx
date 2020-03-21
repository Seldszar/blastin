import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { useState, FunctionComponent } from 'react'
import InfiniteScroll from "react-infinite-scroller"

import { EventInstance } from "~/stores";

import BitsBadgeTier from './events/BitsBadgeTier';
import Cheer from './events/Cheer';
import GiftPaidUpgrade from './events/GiftPaidUpgrade';
import Raid from './events/Raid';
import Resubscription from './events/Resubscription';
import Subscription from './events/Subscription';
import SubscriptionGift from './events/SubscriptionGift';
import SubscriptionMysteryGift from './events/SubscriptionMysteryGift';

interface Props {
  chunkCount?: number;
  events: EventInstance[];
  onItemClick?: (event: EventInstance) => void;
}

const WrappedEvent = ({ event, ...rest }) => {
  switch (event.type) {
    case "bitsbadgetier":
      return <BitsBadgeTier event={event} {...rest} />

    case "cheer":
      return <Cheer event={event} {...rest} />

    case "giftpaidupgrade":
      return <GiftPaidUpgrade event={event} {...rest} />

    case "raid":
      return <Raid event={event} {...rest} />

    case "resub":
      return <Resubscription event={event} {...rest} />

    case "sub":
      return <Subscription event={event} {...rest} />

    case "anonsubgift":
    case "subgift":
      return <SubscriptionGift event={event} {...rest} />

    case "submysterygift":
      return <SubscriptionMysteryGift event={event} {...rest} />
  }

  return null
}

const EventList: FunctionComponent<Props> = ({ events, onItemClick, chunkCount = 25 }) => {
  const [page, setPage] = useState(0)

  const filteredEvents = events.slice(0, page * chunkCount)

  return (
    <InfiniteScroll hasMore={events.length > filteredEvents.length} loadMore={setPage} useWindow={false} threshold={0}>
      {filteredEvents.map(event => (
        <WrappedEvent key={event.id} event={event} onClick={onItemClick && (() => onItemClick(event))} />
      ))}
    </InfiniteScroll>
  )
}

EventList.propTypes = {
  chunkCount: PropTypes.number,
  events: PropTypes.array.isRequired,
  onItemClick: PropTypes.func,
}

export default observer(EventList)
