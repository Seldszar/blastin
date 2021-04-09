import clsx from "clsx";
import PropTypes from "prop-types";
import { FunctionComponent, ReactNode } from "react";

import { FilterInstance } from "@/stores";

import Sidebar from "./sidebar";

import styles from "./layout.module.scss";

interface Props {
  children: ReactNode;
  className?: string;
  filters: FilterInstance[];
  onCreateFilter?: () => void;
  value?: string;
}

const Layout: FunctionComponent<Props> = ({ children, className, filters, onCreateFilter }) => (
  <div className={clsx(styles.wrapper, className)}>
    <Sidebar className={styles.sidebar} filters={filters} onCreateFilter={onCreateFilter} />

    <div className={styles.main}>{children}</div>
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  filters: PropTypes.array.isRequired,
  onCreateFilter: PropTypes.func,
};

export default Layout;
