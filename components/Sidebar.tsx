import clsx from "clsx"
import { observer } from "mobx-react"
import dynamic from 'next/dynamic'
import { useRouter } from "next/router"
import PropTypes from 'prop-types'
import { FunctionComponent } from "react"
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import { FilterInstance, useStore } from "~/stores"

import SidebarLink from "./SidebarLink"

import styles from "./Sidebar.module.scss"

interface Props {
  className?: string;
  filters: FilterInstance[];
  onCreateFilter?: () => void;
  onLogout?: () => void;
}

const SortableItem = SortableElement(
  observer(({ filter }) => (
    <SidebarLink
      key={filter.id}
      href="/filters/[id]"
      as={`/filters/${filter.id}`}
      icon={filter.icon}
      title={filter.title}
      unread={filter.unreadEvents.length}
      opaque
    />
  ))
)

const SortableList = dynamic(
  async () => SortableContainer(({ filters }) => (
    <div>
      {filters.map((filter, index) => (
        <SortableItem key={filter.id} index={index} filter={filter} />
      ))}
    </div>
  )),
  {
    ssr: false
  }
)

const Sidebar: FunctionComponent<Props> = ({ className, filters, onCreateFilter }) => {
  const router = useRouter()
  const store = useStore()

  const onSortEnd = ({ oldIndex, newIndex }) => {
    store.moveFilter(oldIndex, newIndex)
  }

  const onLogout = () => {
    store.setToken(undefined)
    router.replace("/")
  }

  return (
    <div className={clsx(styles.wrapper, className)}>
      <SortableList
        lockAxis="y"
        distance={5}
        filters={filters}
        helperClass={styles.helper}
        onSortEnd={onSortEnd}
      />

      {filters.length > 0 && (
        <hr />
      )}

      <SidebarLink icon="Add" onClick={onCreateFilter} />

      <div className={styles.expander} />

      <SidebarLink icon="PowerButton" onClick={onLogout} />
    </div>
  )
}

Sidebar.propTypes = {
  className: PropTypes.string,
  filters: PropTypes.array.isRequired,
  onCreateFilter: PropTypes.func,
}

export default dynamic(async () => Sidebar, {
  ssr: false,
})
