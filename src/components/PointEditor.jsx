import React from "react"
import ScaleControl from "./ScaleControl"

export default function PointEditor(props) {
  const { onSave, editPoint } = props

  return (
    <>
      Start: {editPoint.times.start}
      <br />
      End: {editPoint.times.end}
      <br />
      <ScaleControl onSave={onSave} />
    </>
  )
}
