import React, { useState } from "react"
import styled from "styled-components";
import { EditPoint } from "../types/video"
import ScaleControl from "./ScaleControl"
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
`;

interface Props {
  editPoint: EditPoint;
  onSave: (edit: EditPoint) => void;
}

const tabs = [
  {name: "scale", label: "Scale"},
  {name: "cut", label: "Cut"},
]

export default function PointEditor(props: Props) {
  const { onSave, editPoint } = props
  const [currentTab, setCurrentTab]: [string, (value: string) => void] = useState("scale");

  function tab(tab: TabData, index: number) {
    const className = tab.name == currentTab ? "active" : "";
    return <Tab key={index} className={className} onClick={() => setCurrentTab(tab.name)}>
             {tab.label}
           </Tab>
  }

  return (
    <>
      Start: {editPoint.times.start}
      <br />
      {hasEndTime(editPoint) && (
        <>
          End: {editPoint.times.end}
          <br />
        </>
      )}
      <TabsBackground>
        {tabs.map(tab)}
      </TabsBackground>
      <div>
        {currentTab === "scale" && <ScaleControl editPoint={editPoint} onSave={onSave} />}
        {currentTab === "cut" && <>Cut</>}
      </div>
    </>
  )
}
