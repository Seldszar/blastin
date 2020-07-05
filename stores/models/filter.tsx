import { types, Instance, getRoot, cast } from "mobx-state-tree";
import uniqueString from "unique-string";

import { queryParser } from "lib/helpers";

import { EventInstance } from "./event";
import { StoreInstance } from "./store";

export const Filter = types
  .model({
    id: types.optional(types.identifier, uniqueString),
    icon: types.optional(types.string, "filter"),
    title: types.string,
    query: types.string,
  })
  .views((self) => ({
    get filterCallback(): (event: EventInstance) => boolean {
      if (self.query) {
        try {
          const expression = queryParser.parse(self.query);

          return (event: EventInstance) => {
            try {
              return Boolean(expression.evaluate(cast(event)));
            } catch {
              return false;
            }
          };
        } catch {
          // ...
        }
      }

      return () => true;
    },
  }))
  .views((self) => ({
    get events(): EventInstance[] {
      return getRoot<StoreInstance>(self)
        .events.filter((event) => self.filterCallback(event))
        .sort((a, b) => a.date.getTime() - b.date.getTime());
    },
  }))
  .views((self) => ({
    get unreadEvents(): EventInstance[] {
      return self.events.filter((event) => event.readState === "unread");
    },
    get readEvents(): EventInstance[] {
      return self.events.filter((event) => event.readState === "read");
    },
  }))
  .actions((self) => {
    const clearReadEvents = () => {
      const store = getRoot<StoreInstance>(self);

      self.readEvents.forEach((event) => {
        store.removeEvent(event);
      });
    };

    const markAsRead = () => {
      self.unreadEvents.forEach((event) => {
        event.markAsRead();
      });
    };

    return {
      clearReadEvents,
      markAsRead,
    };
  });

export type FilterInstance = Instance<typeof Filter>;
