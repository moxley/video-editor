import React from "react";
import { EditPoint } from "../types/video";
import styled from "styled-components";

interface Props {
  editPoint: EditPoint;
  className?: string;
}

const Label = styled.label`
  width: 10em;
`;

const Value = styled.div`
  display: inline-block;
  margin: 0 0.5em;
  font-family: monospace;
  background-color: #eee;
  padding: 0 3px;
`;

export default function PointTimes(props: Props) {
  const { editPoint, className } = props;

  return (
    <div className={className}>
      <Label>Time:</Label>
      <Value>{editPoint.times.start}</Value>
      to
      <Value>{editPoint.times.end}</Value>
    </div>
  );
}
