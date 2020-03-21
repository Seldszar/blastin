import clsx from "clsx"
import PropTypes from 'prop-types'
import { FunctionComponent } from "react"

import { FilterInstance } from "~/stores"

import styles from "./FilterHeader.module.scss"

interface Props {
  className?: string;
  filter: FilterInstance;
  onClearClick?: () => void;
  onUpdateClick?: () => void;
}

const FilterHeader: FunctionComponent<Props> = ({ className, filter, onClearClick, onUpdateClick }) => (
  <div className={clsx(styles.wrapper, className)}>
    <div className={styles.title} onClick={onUpdateClick}>
      {filter.title}
      <div className={clsx("ms-Icon ms-Icon--EditSolid12", styles.editIcon)} />
    </div>

    <div className={styles.actionButton} onClick={onClearClick}>
      <div className="ms-Icon ms-Icon--CheckMark" />
    </div>
  </div>
)

FilterHeader.propTypes = {
  className: PropTypes.string,
  filter: PropTypes.any,
  onUpdateClick: PropTypes.func,
}

export default FilterHeader
