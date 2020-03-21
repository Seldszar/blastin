import LoadingIcon from "~/components/LoadingIcon"

import styles from "./SplashLayout.module.scss"

const SplashLayout = ({ children }) => (
  <div className={styles.wrapper}>
    <div className={styles.loadingIcon}>
      <LoadingIcon />
    </div>
    {children && (
      <div className={styles.message}>
        {children}
      </div>
    )}
  </div>
)

export default SplashLayout
