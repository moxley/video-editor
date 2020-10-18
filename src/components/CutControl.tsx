import React from "react";
import ControlWrapper from "./ControlWrapper";
import { EditPoint } from "../types/video";

interface Props {
  editPoint: EditPoint;
  onSave: (value: EditPoint) => void;
  onClose: () => void;
}

export default function CutControl(props: Props) {
  const { editPoint } = props;

  function onSave() {
    props.onSave({ ...editPoint, command: "cut" });
  }

  return (
    <ControlWrapper>
      <div>
        <button onClick={props.onClose}>Close</button>
      </div>
      ID: {editPoint.id}<br />
      Start: {editPoint.times.start}<br />
      End: {editPoint.times.end}<br />
    </ControlWrapper>
  );
}
