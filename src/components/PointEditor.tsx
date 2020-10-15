import React from "react"
import { EditPoint } from "../types/video"
import ScaleControl from "./ScaleControl"

interface Props {
  editPoint: EditPoint;
  onSave: (edit: EditPoint) => void;
}

export default function PointEditor(props: Props) {
  const { onSave, editPoint } = props

  return (
    <>
      Start: {editPoint.times.start}
      <br />
      End: {editPoint.times.end}
      <br />
      <ScaleControl editPoint={editPoint} onSave={onSave} />
    </>
  )
}
