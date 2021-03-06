import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useState } from "react";
import { useToggle } from "react-use";

import { useStore, FilterInstance } from "@/stores";

import FilterHeader from "@/components/filter-header";
import FilterModal from "@/components/filter-modal";
import Layout from "@/components/layout";

import EventList from "./event-list";
import Scroller from "./scroller";

import styles from "./filter-details.module.scss";

const FilterDetails = () => {
  const [modalOpen, toggleModal] = useToggle(false);

  const [activeFilter, setActiveFilter] = useState<FilterInstance | null>(null);

  const router = useRouter();
  const store = useStore();

  const filter = store.findFilter(router.query.id as string);

  if (!filter) {
    return null;
  }

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
              <EventList events={filter.events} onItemClick={(event) => event.markAsRead()} />
            </Scroller>
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
