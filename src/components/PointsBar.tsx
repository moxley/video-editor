import React, { useRef, useState } from "react"

export default function PointsBar(props: any) {
  const { editPoint, videoRef, edits } = props
  const listenerSetRef = useRef(false)
  const [videoState, setVideoState] = useState({
    playHead: null,
    duration: null,
  })

  if (videoRef.current && !listenerSetRef.current) {
    videoRef.current.addEventListener("timeupdate", (ev: any) => {
      const time = ev.target.currentTime
      const video = videoRef.current
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

  function startIndicator(edit: any) {
    const { times } = edit
    if (!(videoState.duration && times.start)) return null

    const startPercent = (times.start / videoState.duration) * 100

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
        onClick={() => props.onEdit(edit)}
      >
        &nbsp;
      </div>
    )
  }

  function endIndicator(edit: any) {
    const { times } = edit
    if (!(videoState.duration && times.end)) return null
    const percent = (times.end / videoState.duration) * 100
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

  function SingleEdit(props: any) {
    const { edit } = props

    return (
      <>
        {startIndicator(edit)}
        {endIndicator(edit)}
      </>
    )
  }

  function editsRendered() {
    if (!editPoint || !edits) return null
    console.log("editPoint", editPoint)
    console.log("edits", edits)
    return (
      <>
        <SingleEdit edit={editPoint} />
        {edits.map((edit: any, index: number) => <SingleEdit edit={edit} key={index} />)}
      </>
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
      {editsRendered()}
    </div>
  )
}
