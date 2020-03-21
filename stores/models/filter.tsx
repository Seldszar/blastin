import { Parser } from "expr-eval"
import { types, Instance, getParent } from "mobx-state-tree"
import uniqueString from "unique-string"

import { EventInstance } from "./event"
import { StoreInstance } from "./store"

const parser = new Parser({
  operators: {
    assignment: false,
    concatenate: false,
    conditional: false,
  },
})

export const Filter = types
  .model({
    id: types.optional(types.identifier, uniqueString),
    icon: types.optional(types.string, "filter"),
    title: types.string,
    query: types.string,
  })
  .views(self => ({
    get filterCallback(): (data: any) => boolean {
      if (self.query) {
        try {
          const expression = parser.parse(self.query)

          return (data: any) => {
            return !!expression.evaluate(data)
          }
        } catch {}
      }

      return () => true
    },
  }))
  .views(self => ({
    get events(): EventInstance[] {
      return getParent<StoreInstance>(self, 2)?.events.filter(self.filterCallback) ?? []
    },
  }))
  .views(self => ({
    get unreadEvents(): EventInstance[] {
      return self.events.filter(event => event.readState === "unread")
    },
    get readEvents(): EventInstance[] {
      return self.events.filter(event => event.readState === "read")
    },
  }))
  .actions(self => {
    const markAsRead = () => {
      self.unreadEvents.forEach(event => {
        event.markAsRead()
      })
    }

    return {
      markAsRead
    }
  })

export type FilterInstance = Instance<typeof Filter>
