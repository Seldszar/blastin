import clsx from "clsx"
import { observer } from "mobx-react"
import { useRouter } from "next/router"
import { useState } from "react"
import { useToggle } from "react-use"

import { useStore, FilterInstance } from "~/stores"

import FilterHeader from "~/components/FilterHeader"
import FilterModal from "~/components/FilterModal"
import Layout from "~/components/Layout"

import EventList from "./EventList"
import Scroller from "./Scroller"

import styles from "./FilterDetails.module.scss"

const FilterDetails = () => {
  const [modalOpen, toggleModal] = useToggle(false)
  const [expanded, toggleAcknowledgedEvents] = useToggle(false)

  const [activeFilter, setActiveFilter] = useState<FilterInstance>(null)

  const router = useRouter()
  const store = useStore()

  const filter = store.findFilter(router.query.id as string)

  const unreadEvents = filter?.events.filter(event => event.readState === "unread").sort((a, b) => a.date.getTime() - b.date.getTime())
  const readEvents = filter?.events.filter(event => event.readState === "read").sort((a, b) => b.date.getTime() - a.date.getTime())

  const openFilterModal = (filter: FilterInstance) => {
    setActiveFilter(filter)
    toggleModal(true)
  }

  const handleFilterModalClose = (value?: Partial<FilterInstance>) => {
    if (value) {
      activeFilter
        ? store.updateFilter(activeFilter, value)
        : store.createFilter(value)
    }

    toggleModal(false)
  }

  const handleDeleteFilter = () => {
    if (activeFilter) {
      store.deleteFilter(activeFilter)
      router.push("/filters")
    }

    toggleModal(false)
  }

  return (
    <Layout filters={store.filters} onCreateFilter={() => openFilterModal(null)}>
      {filter && (
        <div className={styles.wrapper}>
          <FilterHeader className={styles.header} filter={filter} onUpdateClick={() => openFilterModal(filter)} onClearClick={() => filter.markAsRead()} />

          <div className={styles.body}>
            <Scroller className={styles.list} innerClassName={styles.listInner}>
              <EventList key={filter.id} events={unreadEvents} onItemClick={event => event.markAsRead()} />
            </Scroller>
          </div>

          <div className={clsx(styles.readEvents, { [styles.expanded]: expanded })}>
            <div className={styles.backdrop} onClick={() => toggleAcknowledgedEvents(false)} />
            <div className={styles.inner}>
              <div className={styles.topBar} onClick={toggleAcknowledgedEvents}>
                <span className={clsx(styles.icon, `ms-Icon ms-Icon--${expanded ? "CaretSolidDown" : "CaretSolidRight"}`)} />
                Acknowledged Events
              </div>

              {expanded && (
                <Scroller className={styles.list} innerClassName={styles.listInner}>
                  <EventList key={filter.id} events={readEvents} />
                </Scroller>
              )}
            </div>
          </div>
        </div>
      )}

      <FilterModal filter={activeFilter} isOpen={modalOpen} onDelete={handleDeleteFilter} onClose={handleFilterModalClose} />
    </Layout>
  )
}

export default observer(FilterDetails)
