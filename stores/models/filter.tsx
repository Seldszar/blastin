import { Parser } from "expr-eval";
import { types, Instance, getRoot } from "mobx-state-tree";
import uniqueString from "unique-string";

import { EventInstance } from "./event";
import { StoreInstance } from "./store";

const parser = new Parser({
  operators: {
    assignment: false,
    concatenate: false,
    conditional: false,
  },
});

export const Filter = types
  .model({
    id: types.optional(types.identifier, uniqueString),
    icon: types.optional(types.string, "filter"),
    title: types.string,
    query: types.string,
  })
  .views((self) => ({
    get filterCallback(): (data: any) => boolean {
      if (self.query) {
        try {
          const expression = parser.parse(self.query);

          return (data: any) => {
            return Boolean(expression.evaluate(data));
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
    const markAsRead = () => {
      self.unreadEvents.forEach((event) => {
        event.markAsRead();
      });
    };

    return {
      markAsRead,
    };
  });

export type FilterInstance = Instance<typeof Filter>;
