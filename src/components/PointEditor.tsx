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
}

const tabs = [
  {name: "scale", label: "Scale"},
  {name: "cut", label: "Cut"},
]

const defaultCommand = "scale";

export default function PointEditor(props: Props) {
  const { onSave, editPoint } = props
  const [currentTab, setCurrentTab]: [string, (value: string) => void] = useState(defaultCommand);

  function tab(tab: TabData, index: number) {
    const className = tab.name == currentTab ? "active" : "";
    return <Tab key={index} className={className} onClick={() => setCurrentTab(tab.name)}>
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

      <div>
        <TabsBackground>
          {tabs.map(tab)}
        </TabsBackground>

        <div>
          {currentTab === "scale" && <ScaleControl editPoint={editPoint} onSave={onSave} />}
          {currentTab === "cut" && <CutControl editPoint={editPoint} onSave={onSave} />}
        </div>
      </div>
    </>
  )
}
