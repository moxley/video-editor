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
        {tabs.map((tab: TabData, index: number) => {
          return <Tab key={index} className={`${tab.name == currentTab ? "active" : ""}`}>{tab.label}</Tab>
        })}
      </TabsBackground>
      <div>
        <ScaleControl editPoint={editPoint} onSave={onSave} />
      </div>
    </>
  )
}
