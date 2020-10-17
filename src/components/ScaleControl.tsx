import React, { useState } from "react"
import { EditPoint } from "../types/video"
import ControlWrapper from "./ControlWrapper";

interface Props {
  editPoint: EditPoint;
  onSave?: (edit: EditPoint) => void
}

export default function ScaleControl(props: Props) {
  const [editPoint, setEditPoint]: [EditPoint, (value: EditPoint) => void] = useState(props.editPoint);

  function applyChanges() {
    const video = document.getElementById("video") as any

    const currentTime = video.currentTime
    const amount = parseInt(editPoint.arguments.amount);
    const origTimes = editPoint.times;
    const updatedEdit: EditPoint = {
      ...editPoint,
      command: "scale",
      times: { ...origTimes, start: currentTime },
      arguments: { amount },
    }

    props.onSave && props.onSave(updatedEdit)
  }

  function percentRadio(value: string) {
    const percent = `${editPoint.arguments.amount}`;
    
    return <>
      <input type="radio" name="amount" value={value} id={`scale-${value}-percent`} defaultChecked={value === percent} onChange={onPercentChange} />
      <label htmlFor={`scale-${value}-percent`}>{value}%</label>
    </>
  }

  function onPercentChange(ev: any) {
    const newEditPoint = { ...editPoint, arguments: { ...editPoint.arguments, amount: ev.target.value }};
    console.log("newEditPoint", newEditPoint);
    setEditPoint(newEditPoint)
  }

  return (
    <ControlWrapper id="scale-control">
      ID: {editPoint.id}<br />
      Start: {editPoint.times.start}<br />
      End: {editPoint.times.end}<br />
      <div className="radio-group">
        {percentRadio("50")}
        {percentRadio("100")}
        {percentRadio("150")}

        <button className="apply" onClick={applyChanges}>
          Apply
        </button>
      </div>
    </ControlWrapper>
  )
}
