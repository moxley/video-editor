import React, { useState } from "react"
import styled from "styled-components";
import { EditPoint } from "../types/video"
import ScaleControl from "./ScaleControl"
import CutControl from "./CutControl";
import VideoConstants from "../lib/VideoConstants";

const rounded = "10px";

const Tab = styled.div`
  display: inline-block;
  padding: 0.25em 1em;
  border-radius: ${rounded} ${rounded} 0px 0px;
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

const Trash = styled.div`
  display: inline-block;
  width: 48px;
  padding: 0 8px;
  margin-right: 8px;
  &:hover { cursor: pointer; }
  & > img { opacity: 0.5; }
  &:hover > img {
    opacity: 1.0;
  }
`;

const TrashIcon = styled.img`
  width: 20px;
  display: inline-block;
  margin: 0 8px -4px 8px;
`;

const CloseButton = styled.div`
  position: absolute;
  padding: 2px 8px;
  img { opacity: 0.5; }
  &:hover { cursor: pointer; }
  &:hover > img {
    opacity: 1.0;
  }
`;

const CloseIcon = styled.img`
  width: 16px;
`;

interface Props {
  editPoint: EditPoint;
  onSave: (edit: EditPoint) => void;
  onDelete: (edit: EditPoint) => void;
  onClose: () => void;
  containerRef: React.RefObject<HTMLElement>;
}

const tabs = [
  {name: "scale", label: "Scale"},
  {name: "cut", label: "Cut"},
]

export default function PointEditor(props: Props) {
  const { editPoint, onSave, onClose, containerRef } = props

  function setCurrentCommand(command: string) {
    onSave({ ...editPoint, command })
  }

  function tab(tab: TabData, index: number) {
    const className = tab.name === editPoint.command ? "active" : "";
    return <Tab key={index} className={className} onClick={() => setCurrentCommand(tab.name)}>
             {tab.label}
           </Tab>
  }

  const { start, end } = editPoint.times;
  const timelineWidth = containerRef.current.clientWidth;
  const startX = (start / VideoConstants.timelineLength) * timelineWidth;
  const endX = (end / VideoConstants.timelineLength) * timelineWidth;
  const centerOffset = (endX - startX) / 2;
  const centerX = startX + centerOffset;
  const width = 300;
  const left = Math.min(
    Math.max(0, centerX - (width / 2)),
    timelineWidth - width
  );

  return (
    <div style={{position: "absolute", left: `${left}px`, width: `${width}px`}}>
      <Editor>
        <TabsBackground>
          <Trash onClick={() => props.onDelete(editPoint)}>
            <TrashIcon src="/images/trash-icon.svg" />
          </Trash>
          {tabs.map(tab)}
        </TabsBackground>

        <div>
          {editPoint.command === "scale" && <ScaleControl editPoint={editPoint} onSave={onSave} />}
          {editPoint.command === "cut" && <CutControl editPoint={editPoint} onSave={onSave} />}
        </div>
        <CloseButton style={{right: 0, top: "5px"}} onClick={onClose}>
          <CloseIcon src="/images/close-icon.svg" />
        </CloseButton>
      </Editor>
    </div>
  )
}
