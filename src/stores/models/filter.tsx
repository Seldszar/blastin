import { types, Instance, getRoot, cast, SnapshotIn, SnapshotOut } from "mobx-state-tree";
import { nanoid } from "nanoid";

import { readStateOrder } from "@/constants";
import { queryParser } from "@/helpers";

import { EventInstance } from "./event";
import { StoreInstance } from "./store";

export const Filter = types
  .model({
    id: types.optional(types.identifier, nanoid),
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
      const store = getRoot<StoreInstance>(self);

      return store.profileEvents
        .filter((event) => self.filterCallback(event))
        .sort((left, right) => {
          const leftState = readStateOrder.indexOf(left.readState);
          const rightState = readStateOrder.indexOf(right.readState);

          if (leftState < rightState) {
            return -1;
          }

          if (leftState > rightState) {
            return 1;
          }

          return right.date.getTime() - left.date.getTime();
        });
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
export type FilterSnapshotIn = SnapshotIn<typeof Filter>;
export type FilterSnapshotOut = SnapshotOut<typeof Filter>;
