import clsx from "clsx";
import PropTypes from "prop-types";
import { useState, ReactNode, FunctionComponent } from "react";

import Icon from "./icon";

import styles from "./modal.module.scss";

export interface ModalProps {
  children: (props: { close: () => void }) => ReactNode;
  isOpen?: boolean;
  large?: boolean;
  onClose?: (value?: any) => void;
  title?: string;
}

const Modal: FunctionComponent<ModalProps> = ({ children, isOpen, large, onClose, title }) => {
  const [needFocus, setNeedFocus] = useState(false);

  const close = (value?: any) => {
    onClose?.(value);
  };

  return isOpen ? (
    <div
      className={clsx(styles.wrapper, { [styles.large]: large })}
      onMouseDown={() => setNeedFocus(true)}
      onMouseUp={() => setNeedFocus(false)}
    >
      <div className={styles.inner}>
        <div
          className={clsx(styles.content, { [styles.needFocus]: needFocus })}
          onMouseDown={(event) => event.stopPropagation()}
          onMouseUp={(event) => event.stopPropagation()}
        >
          <button type="button" className={styles.closeButton} onClick={() => close()}>
            <Icon name="close" />
          </button>

          {title && <h1 className={styles.title}>{title}</h1>}

          {children({ close })}
        </div>
      </div>
    </div>
  ) : null;
};

Modal.propTypes = {
  children: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  large: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
};

export default Modal;
