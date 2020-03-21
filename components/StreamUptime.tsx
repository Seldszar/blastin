import PropTypes from "prop-types"
import { useInterval } from "react-use"
import { useState, useEffect } from "react"

const StreamUptime = ({ startedAt }) => {
  const [timeString, setTimeString] = useState(null)

  const updateTimeString = () => {
    const time = Date.now() - startedAt.getTime()

    const hours = Math.floor((time / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((time / (1000 * 60)) % 60)
    const seconds = Math.floor((time / 1000) % 60)

    const parts = []

    if (hours > 0) {
      parts.push(`${hours}h`)
    }

    if (hours + minutes > 0) {
      parts.push(`${String(minutes).padStart(2, "0")}m`)
    }

    parts.push(`${String(seconds).padStart(2, "0")}s`)

    setTimeString(parts.join(" "))
  }

  useInterval(updateTimeString, 1000)
  useEffect(updateTimeString)

  return timeString
}

StreamUptime.propTypes = {
  startedAt: PropTypes.instanceOf(Date),
}

export default StreamUptime
