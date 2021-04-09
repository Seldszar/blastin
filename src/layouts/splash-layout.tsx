import PropTypes from "prop-types";
import { FunctionComponent } from "react";

import LoadingIcon from "@/components/loading-icon";

import styles from "./splash-layout.module.scss";

const SplashLayout: FunctionComponent = ({ children }) => (
  <div className={styles.wrapper}>
    <div className={styles.loadingIcon}>
      <LoadingIcon />
    </div>
    {children && <div className={styles.message}>{children}</div>}
  </div>
);

SplashLayout.propTypes = {
  children: PropTypes.node,
};

export default SplashLayout;
