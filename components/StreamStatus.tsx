import clsx from "clsx"
import { observer } from "mobx-react"
import dynamic from "next/dynamic"
import PropTypes from "prop-types"

import { useStore } from "~/stores"

import StreamUptime from "./StreamUptime"

import styles from "./StreamStatus.module.scss"

const StreamStatus = ({ className }) => {
  const { stream, user } = useStore()

  return (
    <div className={clsx(styles.wrapper, className)}>
      <div className={styles.profileImage}>
        {user && (
          <img src={user.profileImageUrl} />
        )}
      </div>
      {stream ? (
        <div className={styles.streamInfo}>
          <div className={styles.streamUptime}>
            <header>Uptime</header>
            <StreamUptime startedAt={stream.startedAt} />
          </div>
          <div className={styles.viewerCount}>
            <header>Viewers</header>
            {stream.viewerCount}
          </div>
          {stream.game && (
            <div className={styles.gameName}>
              <header>Game</header>
              {stream.game.name}
            </div>
          )}
          <div className={styles.streamTitle}>
            <header>Title</header>
            {stream.title}
          </div>
        </div>
      ) : (
        <div className={styles.offlineMessage}>
          Stream Offline
        </div>
      )}
    </div>
  )
}

StreamStatus.propTypes = {
  className: PropTypes.string,
}

export default dynamic(async () => observer(StreamStatus), {
  ssr: false,
})
