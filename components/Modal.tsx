import { UniversalPortal } from "@jesstelford/react-portal-universal"
import clsx from "clsx"
import PropTypes from 'prop-types'
import { useState, ReactNode, FunctionComponent } from "react"

import styles from "./Modal.module.scss"

interface Props {
  children: (props: { close: () => void }) => ReactNode;
  isOpen?: boolean;
  onClose?: (value?: any) => void;
  title?: string;
}

const Modal: FunctionComponent<Props> = ({ children, isOpen, onClose, title }) => {
  const [needFocus, setNeedFocus] = useState(false)

  if (!isOpen) {
    return null
  }

  const close = (value?: any) => {
    onClose?.(value)
  }

  return (
    <UniversalPortal selector="#modal">
      <div className={styles.wrapper} onMouseDown={() => setNeedFocus(true)} onMouseUp={() => setNeedFocus(false)}>
        <div className={styles.inner}>
          <div className={clsx(styles.content, { [styles.needFocus]: needFocus })} onMouseDown={event => event.stopPropagation()} onMouseUp={event => event.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => close()}>
              <span className="ms-Icon ms-Icon--Cancel" />
            </button>

            {title && (
              <h1 className={styles.title}>
                {title}
              </h1>
            )}

            {children({ close })}
          </div>
        </div>
      </div>
    </UniversalPortal>
  )
}

Modal.propTypes = {
  children: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
}

export default Modal
