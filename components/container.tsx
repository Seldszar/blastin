import PropTypes from "prop-types";
import { FunctionComponent } from "react";

import styles from "./container.module.scss";

const Container: FunctionComponent = ({ children }) => (
  <div className={styles.wrapper}>
    <div className={styles.main}>{children}</div>
  </div>
);

Container.propTypes = {
  children: PropTypes.node,
};

export default Container;
