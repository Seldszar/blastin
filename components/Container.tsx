import Titlebar from "./Titlebar"

import styles from "./Container.module.scss"

const Container = ({ children }) => (
  <div className={styles.wrapper}>
    {/* <div className={styles.titlebar}>
      <Titlebar />
    </div> */}
    <div className={styles.main}>
      {children}
    </div>
  </div>
)

export default Container
