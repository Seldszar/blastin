import clsx from "clsx";
import PropTypes from "prop-types";
import { FunctionComponent } from "react";

import { FilterInstance } from "stores";

import Icon from "./icon";

import styles from "./filter-header.module.scss";

interface Props {
  className?: string;
  filter: FilterInstance;
  onClearClick?: () => void;
  onUpdateClick?: () => void;
}

const FilterHeader: FunctionComponent<Props> = ({
  className,
  filter,
  onClearClick,
  onUpdateClick,
}) => (
  <div className={clsx(styles.wrapper, className)}>
    <div className={styles.title} onClick={onUpdateClick}>
      {filter.title}
      <Icon className={styles.editIcon} name="EditSolid12" />
    </div>

    <div className={styles.actionButton} onClick={onClearClick}>
      <Icon name="CheckMark" />
    </div>
  </div>
);

FilterHeader.propTypes = {
  className: PropTypes.string,
  filter: PropTypes.any,
  onClearClick: PropTypes.func,
  onUpdateClick: PropTypes.func,
};

export default FilterHeader;
