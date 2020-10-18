import React from "react";
import ControlWrapper from "./ControlWrapper";
import { EditPoint } from "../types/video";
import PointTimes from "./PointTimes";

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
      <PointTimes editPoint={editPoint} />
    </ControlWrapper>
  );
}
