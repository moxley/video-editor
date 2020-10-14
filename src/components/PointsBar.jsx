import React, { useRef, useState } from "react"

export default function PointsBar(props) {
  const { editPoint, videoRef } = props
  const { start, end } = editPoint.times
  const listenerSetRef = useRef(false)
  const [videoState, setVideoState] = useState({
    playHead: null,
    duration: null,
  })

  if (videoRef.current && !listenerSetRef.current) {
    videoRef.current.addEventListener("timeupdate", (ev) => {
      const time = ev.target.currentTime
      setVideoState({ playHead: time, duration: video.duration })
    })
    listenerSetRef.current = true
  }

  function playHeadIndicator() {
    if (!videoState.playHead) return null
    const percent = (videoState.playHead / videoState.duration) * 100

    return (
      <div
        style={{
          height: "10px",
          backgroundColor: "#aaa",
          marginBottom: "1em",
          marginTop: "0.5em",
          position: "relative",
          width: `${percent}%`,
        }}
      ></div>
    )
  }

  function startIndicator() {
    if (!(videoState.duration && start)) return null

    const startPercent = (start / videoState.duration) * 100

    return (
      <div
        style={{
          width: "4px",
          height: "19px",
          backgroundColor: "rgb(216, 216, 0)",
          top: "-5px",
          position: "absolute",
          left: `${startPercent}%`,
          cursor: "grabbing",
        }}
      >
        &nbsp;
      </div>
    )
  }

  function endIndicator() {
    if (!(videoState.duration && end)) return null
    const percent = (end / videoState.duration) * 100
    return (
      <div
        style={{
          width: "4px",
          height: "19px",
          backgroundColor: "#0aa",
          top: "-5px",
          position: "absolute",
          left: `${percent}%`,
          cursor: "grabbing",
        }}
      >
        &nbsp;
      </div>
    )
  }

  return (
    <div
      style={{
        height: "10px",
        backgroundColor: "#888",
        marginBottom: "1em",
        marginTop: "0.5em",
        position: "relative",
      }}
    >
      {playHeadIndicator()}
      {startIndicator()}
      {endIndicator()}
    </div>
  )
}
