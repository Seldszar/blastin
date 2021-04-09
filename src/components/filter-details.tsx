import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useState, MouseEvent } from "react";
import { useToggle } from "react-use";

import { useStore, FilterInstance } from "@/stores";

import FilterHeader from "@/components/filter-header";
import FilterModal from "@/components/filter-modal";
import Layout from "@/components/layout";

import EventList from "./event-list";
import Icon from "./icon";
import Scroller from "./scroller";

import styles from "./filter-details.module.scss";

const FilterDetails = () => {
  const [modalOpen, toggleModal] = useToggle(false);
  const [expanded, toggleAcknowledgedEvents] = useToggle(false);

  const [activeFilter, setActiveFilter] = useState<FilterInstance | null>(null);

  const router = useRouter();
  const store = useStore();

  const filter = store.findFilter(router.query.id as string);

  if (!filter) {
    return null;
  }

  const unreadEvents = filter.unreadEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
  const readEvents = filter.readEvents.sort((a, b) => b.date.getTime() - a.date.getTime());

  const openFilterModal = (filter: FilterInstance | null) => {
    setActiveFilter(filter);
    toggleModal(true);
  };

  const handleFilterModalClose = (value?: Partial<FilterInstance>) => {
    if (value) {
      if (activeFilter) {
        store.updateFilter(activeFilter, value);
      } else {
        store.createFilter(value);
      }
    }

    toggleModal(false);
  };

  const handleDeleteFilter = () => {
    if (activeFilter) {
      store.deleteFilter(activeFilter);
      router.push("/filters");
    }

    toggleModal(false);
  };

  const handleClearReadEvents = (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();

    filter.clearReadEvents();
  };

  return (
    <Layout filters={store.filters} onCreateFilter={() => openFilterModal(null)}>
      {filter && (
        <div className={styles.wrapper}>
          <FilterHeader
            className={styles.header}
            filter={filter}
            onUpdateClick={() => openFilterModal(filter)}
            onClearClick={() => filter.markAsRead()}
          />

          <div className={styles.body}>
            <Scroller className={styles.list} innerClassName={styles.listInner}>
              <EventList
                key={filter.id}
                events={unreadEvents}
                onItemClick={(event) => event.markAsRead()}
              />
            </Scroller>
          </div>

          <div className={clsx(styles.readEvents, { [styles.expanded]: expanded })}>
            <div className={styles.backdrop} onClick={() => toggleAcknowledgedEvents(false)} />
            <div className={styles.inner}>
              <div className={styles.topBar} onClick={toggleAcknowledgedEvents}>
                <Icon className={styles.icon} name={expanded ? "ChevronDown" : "ChevronRight"} />
                <div className={styles.title}>
                  Acknowledged Events{readEvents.length > 0 && ` (${readEvents.length})`}
                </div>
                {readEvents.length > 0 && (
                  <div className={styles.clearAction} onClick={handleClearReadEvents}>
                    <Icon name="Delete" />
                  </div>
                )}
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

      <FilterModal
        filter={activeFilter}
        isOpen={modalOpen}
        onDelete={handleDeleteFilter}
        onClose={handleFilterModalClose}
      />
    </Layout>
  );
};

export default observer(FilterDetails);
