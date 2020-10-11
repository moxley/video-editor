import React from "react"

export default function PointsBar() {
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
          width: "4px",
          height: "19px",
          backgroundColor: "yellow",
          top: "-5px",
          position: "absolute",
          left: "30%",
          cursor: "grabbing",
        }}
      >
        &nbsp;
      </div>
    </div>
  )
}
