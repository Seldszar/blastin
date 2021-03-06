import clsx from "clsx";
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { FunctionComponent } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { useToggle } from "react-use";

import { FilterInstance, useStore } from "@/stores";

import SettingsModal from "./settings-modal";
import SidebarLink from "./sidebar-link";

import styles from "./sidebar.module.scss";

interface SortableItemProps {
  filter: FilterInstance;
}

const SortableItem = SortableElement(
  observer<SortableItemProps>(({ filter }) => (
    <SidebarLink
      key={filter.id}
      isOpaque
      href="/filters/[id]"
      as={`/filters/${filter.id}`}
      icon={filter.icon}
      title={filter.title}
      unread={filter.unreadEvents.length}
    />
  ))
);

interface SortableListProps {
  filters: FilterInstance[];
}

const SortableList = dynamic(
  async () =>
    SortableContainer(({ filters }: SortableListProps) => (
      <div>
        {filters.map((filter, index) => (
          <SortableItem key={filter.id} index={index} filter={filter} />
        ))}
      </div>
    )),
  {
    ssr: false,
  }
);

interface SortableProps {
  className?: string;
  filters: FilterInstance[];
  onCreateFilter?: () => void;
  onLogout?: () => void;
}

const Sidebar: FunctionComponent<SortableProps> = ({ className, filters, onCreateFilter }) => {
  const [modalOpen, toggleModal] = useToggle(false);

  const router = useRouter();
  const store = useStore();

  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    store.moveFilter(oldIndex, newIndex);
  };

  const onLogout = () => {
    store.setToken(undefined);
    router.replace("/");
  };

  return (
    <div className={clsx(styles.wrapper, className)}>
      <SortableList
        lockAxis="y"
        distance={5}
        filters={filters}
        helperClass={styles.helper}
        onSortEnd={onSortEnd}
      />

      <SidebarLink icon="plus" onClick={onCreateFilter} />

      <div className={styles.expander} />

      <SidebarLink icon="cog" onClick={() => toggleModal(true)} />
      <SidebarLink icon="power" onClick={onLogout} />

      <SettingsModal isOpen={modalOpen} onClose={() => toggleModal(false)} />
    </div>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  filters: PropTypes.array.isRequired,
  onCreateFilter: PropTypes.func,
};

export default dynamic(async () => Sidebar, {
  ssr: false,
});
