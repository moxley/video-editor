import React from "react"

export default function PointsBar(props) {
  const { videoDuration, editPoint } = props
  const { start, end } = editPoint.times

  function startIndicator() {
    if (!(videoDuration && start)) return null

    const startPercent = (start / videoDuration) * 100

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
    if (!(videoDuration && end)) return null
    const percent = (end / videoDuration) * 100
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
      <div
        style={{
          height: "10px",
          backgroundColor: "#aaa",
          marginBottom: "1em",
          marginTop: "0.5em",
          position: "relative",
          width: "20%",
        }}
      ></div>
      {startIndicator()}
      {endIndicator()}
    </div>
  )
}
