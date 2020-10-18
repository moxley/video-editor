import React, { useState } from "react"
import styled from "styled-components";
import { EditPoint } from "../types/video"
import ScaleControl from "./ScaleControl"
import CutControl from "./CutControl";
import { hasEndTime } from "../lib/editCommand";

const rounded = "10px";

const Tab = styled.div`
  display: inline-block;
  padding: 0.25em 1em;
  border-radius: ${rounded} ${rounded} 0px 2px;
  background-color: #ddd;
  &:hover {
    cursor: default;
    background-color: #eee;
  }
  &.active {
    background-color: #fff;
  }
`;

const Editor = styled.div`
  width: 300px;
`;

interface TabData {
  name: string;
  label: string;
}

const TabsBackground = styled.div`
  padding: 0.5em 0.5em 0;
  background-color: #ddd;
  border-radius: 5px 5px 0 0;
`;

interface Props {
  editPoint: EditPoint;
  onSave: (edit: EditPoint) => void;
  onDelete: (edit: EditPoint) => void;
  onClose: () => void;
}

const tabs = [
  {name: "scale", label: "Scale"},
  {name: "cut", label: "Cut"},
]

export default function PointEditor(props: Props) {
  const { editPoint, onSave, onClose } = props

  function setCurrentCommand(command: string) {
    onSave({ ...editPoint, command })
  }

  function tab(tab: TabData, index: number) {
    const className = tab.name === editPoint.command ? "active" : "";
    return <Tab key={index} className={className} onClick={() => setCurrentCommand(tab.name)}>
             {tab.label}
           </Tab>
  }

  return (
    <>
      <div style={{marginBottom: "1em"}}>
        Start: {editPoint.times.start}
        <br />
        {hasEndTime(editPoint) && (
          <>
            End: {editPoint.times.end}
            <br />
          </>
        )}
        <div>
          <button onClick={() => props.onDelete(editPoint)}>Remove edit</button>
        </div>
      </div>

      <Editor>
        <TabsBackground>
          {tabs.map(tab)}
        </TabsBackground>

        <div>
          {editPoint.command === "scale" && <ScaleControl editPoint={editPoint} onSave={onSave} onClose={onClose} />}
          {editPoint.command === "cut" && <CutControl editPoint={editPoint} onSave={onSave} onClose={onClose} />}
        </div>
      </Editor>
    </>
  )
}
