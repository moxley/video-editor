import React from "react"
import { EditPoint } from "../types/video"
import ControlWrapper from "./ControlWrapper";
import { default as PointTimesOrig } from "./PointTimes";
import styled from "styled-components";

const PointTimes = styled(PointTimesOrig)`
  margin-bottom: 1em;
`;

interface Props {
  editPoint: EditPoint;
  onSave: (edit: EditPoint) => void
}

export default function ScaleControl(props: Props) {
  const { editPoint } = props;

  function applyChanges(editPoint: EditPoint) {
    const amount = parseInt(editPoint.arguments.amount);
    const updatedEdit: EditPoint = {
      ...editPoint,
      command: "scale",
      arguments: { amount },
    }

    props.onSave(updatedEdit)
  }

  function percentRadio(value: string) {
    const percent = `${editPoint.arguments.amount}`;
    const checked = value === percent;
    
    return <>
      <input type="radio" name="amount" value={value} id={`scale-${value}-percent`} checked={checked} onChange={onPercentChange} />
      <label htmlFor={`scale-${value}-percent`}>{value}%</label>
    </>
  }

  function onPercentChange(ev: any) {
    applyChanges({ ...editPoint, arguments: { ...editPoint.arguments, amount: ev.target.value }});
  }

  return (
    <ControlWrapper id="scale-control">
      <PointTimes editPoint={editPoint} />
      <label>Scale amount:</label>
      <div className="radio-group">
        {percentRadio("50")}
        {percentRadio("100")}
        {percentRadio("150")}
      </div>
    </ControlWrapper>
  )
}
