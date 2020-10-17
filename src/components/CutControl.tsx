import React from "react";
import ControlWrapper from "./ControlWrapper";
import { EditPoint } from "../types/video";

interface Props {
  editPoint: EditPoint;
  onSave: (value: EditPoint) => void;
}

export default function CutControl(props: Props) {
  const { editPoint } = props;

  function onSave() {
    props.onSave({ ...editPoint, command: "cut" });
  }

  return (
    <ControlWrapper>
      ID: {editPoint.id}<br />
      Start: {editPoint.times.start}<br />
      End: {editPoint.times.end}<br />
      <button onClick={onSave}>Apply</button>
    </ControlWrapper>
  );
}
