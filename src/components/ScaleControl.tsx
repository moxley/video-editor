import React, { useState } from "react"
import { EditPoint } from "../types/video"
import ControlWrapper from "./ControlWrapper";

interface Props {
  editPoint: EditPoint;
  onSave?: (edit: EditPoint) => void
}

export default function ScaleControl(props: Props) {
  const { editPoint } = props;
  const [percent, setPercent]: [string, (value: string) => void] = useState("100")

  function applyChanges() {
    const video = document.getElementById("video") as any

    const currentTime = video.currentTime
    const amount = parseInt(percent);
    const updatedEdit: EditPoint = {
      ...editPoint,
      command: "scale",
      times: { start: currentTime, end: null },
      arguments: { amount },
    }

    props.onSave && props.onSave(updatedEdit)
  }

  function percentRadio(value: string) {
    return <>
      <input type="radio" name="amount" value={value} id={`scale-${value}-percent`} defaultChecked={value === percent} onChange={onPercentChange} />
      <label htmlFor={`scale-${value}-percent`}>{value}%</label>
    </>
  }

  function onPercentChange(ev: any) {
    setPercent(ev.target.value)
  }

  return (
    <ControlWrapper id="scale-control">
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
