import React from "react"
import ScaleControl from "./ScaleControl"

export default function PointEditor(props) {
  const { onSave } = props

  return <ScaleControl onSave={onSave} />
}
