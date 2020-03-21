import clsx from "clsx"
import isElectron from "is-electron"

import styles from "./Titlebar.module.scss"

const Titlebar = () => /* isElectron() && */ (
  <div className={styles.wrapper}>
    <div className={styles.expander} />
    <div className={styles.buttons}>
      <div className={styles.button}>
        <span className="ms-Icon ms-Icon--ChromeMinimize" />
      </div>
      <div className={styles.button}>
        <span className="ms-Icon ms-Icon--ChromeFullScreen" />
      </div>
      <div className={clsx(styles.button, styles.closeButton)}>
        <span className="ms-Icon ms-Icon--ChromeClose" />
      </div>
    </div>
  </div>
)

export default Titlebar
