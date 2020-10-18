import React, { useRef, useState } from "react"
import styled from 'styled-components'
import { EditPoint } from "../types/video"
import VideoConstants from "../lib/VideoConstants";

const BarBackground = styled.div`
  height: 60px;
  margin-bottom: 1em;
  margin-top: 0.5em;
  position: relative;
  box-sizing: border-box;
  background-color: #ddd;
`;

const Bar = styled.div`
  height: 100%;
  background-color: #fff;
  border: 1px solid #aaa;
  position: relative;
  box-sizing: border-box;
  &:hover {
    cursor: pointer;
  }
`;

const activeBg = "#fda";
const activeBorder = "#fa0";
const defaultBg = "#adf";
const defaultBorder = "#0af";

const EditSegment = styled.div<{ active?: boolean }>`
  width: 100px;
  height: 50%;
  background-color: ${(props: any) => props.active ? activeBg : defaultBg};
  border-color: ${(props: any) => props.active ? activeBorder : defaultBorder};
  border-style: solid;
  border-width: 0 1px;
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  &:hover {
    img { opacity: 0.50; }
  }
`;

const EditClickControl = styled.div`
  position: absolute;
  display: inline-block;
  bottom: 0;
  left: 50%;
  border: 1px solid #ccc;
  border-width: 1px 1px 0 0;
  padding: 0.25em 0.5em;
  border-radius: 0 5px 0 0;
  &:hover { cursor: pointer; }
`;

const DragGrip = styled.img`
  position: absolute;
  top: calc(50% - 9px);
  left: 0;
  &:hover { cursor: pointer; }
`;

const CommandIcon = styled.img`
  position: absolute;
  left: calc(50% - 10px);
  top: calc(50% - 10px);
  width: 20px;
  opacity: 0.25;
  &:hover { opacity: 0.80; }
`;

const AddButton = styled.img`
  position: absolute;
  top: 0;
  margin: 0.25em 0 0 0.25em;
  width: 16px;
  &:hover { cursor: pointer; }
`;

interface Props {
  onEdit: (edit: EditPoint) => void;
  onUpdate: (edit: EditPoint) => void;
  newEdit: (edit: EditPoint) => void;
  onSplit: (updatedEdit: EditPoint, newEdit: EditPoint) => void;
  onNewCurrentTime: (time: number) => void;
  activeEditId: string | null;
  videoRef: any;
  videoLoaded: boolean;
  edits: EditPoint[];
  playing: boolean;
}

export default function Timeline(props: Props) {
  const { activeEditId, videoLoaded, videoRef, edits } = props
  const listenerSetRef = useRef(false)
  const [videoState, setVideoState] = useState({
    playHead: null,
  })
  const [hovering, setHovering]: [boolean, (value: boolean) => void] = useState(false as boolean);
  const pointerRef = useRef(null);
  // TODO Why offset -10?
  const offset = 10;
  const backgroundBarRef = useRef(null);
  const barRef = useRef(null);

  if (videoRef.current && !listenerSetRef.current) {
    videoRef.current.addEventListener("timeupdate", (ev: any) => {
      const time = ev.target.currentTime
      setVideoState({ playHead: time })
    })
    listenerSetRef.current = true
  }

  function playHeadIndicator() {
    if (!videoState.playHead) return null
    const percent = (videoState.playHead / VideoConstants.timelineLength) * 100

    return (
      <div style={{position: "relative", left: `${percent}%`, height: "100%"}}>
        <div
          style={{
            height: "100%",
            backgroundColor: "#faa",
            position: "absolute",
            width: "2px",
            top: "1px",
          }}
        />
        <AddButton src="/images/add-btn.svg" onClick={onAdd} />
      </div>
    )
  }

  function onAdd(ev: any) {
    ev.preventDefault();
    ev.stopPropagation();
    const time = videoState.playHead;
    const matchingEdit = edits.find(({ times }: EditPoint) => times.start >= time && times.end <= time)
    const nextSegment = nextEditAfterStart(time);
    const nextStart = nextSegment && nextSegment.times.start || null;
    if (matchingEdit) {
      const times = { start: time, end: nextStart }
      const newEdit = { ...VideoConstants.initialEditPoint, times };
      const updatedEdit = { ...matchingEdit, times: { ...matchingEdit.times, end: times.start }}
      props.onSplit(updatedEdit, newEdit);
    } else {
      const videoEl = videoRef.current;
      const end = nextStart || videoEl.duration;
      const times = { start: time, end }
      const newEdit = { ...VideoConstants.initialEditPoint, times };
      props.newEdit(newEdit);
    }
  }

  function onSplitEdit(ev: any, edit: EditPoint) {
    const times = calculateTimes(ev);
    const newEdit = { ...VideoConstants.initialEditPoint, times };
    const updatedEdit = { ...edit, times: { ...edit.times, end: times.start }}
    props.onSplit(updatedEdit, newEdit);
  }

  function onSetCurrentTime(ev: any) {
    const bgBar = backgroundBarRef.current;
    const x = ev.pageX - offset;
    const videoFraction = x / bgBar.clientWidth;
    const time = videoFraction * VideoConstants.timelineLength;
    props.onNewCurrentTime(time);
  }

  function onEdit(e: any, edit: EditPoint) {
    e.preventDefault();
    e.stopPropagation();
    props.onEdit(edit)
  }

  function SingleEdit(p: any) {
    const { edit } = p;
    const { times } = edit
    if (times.start === null) return null

    const startPercent = (times.start / VideoConstants.timelineLength) * 100
    const widthPercent = ((times.end - times.start) / VideoConstants.timelineLength) * 100;

    return (
      <>
        <EditSegment
          style={{left: `${startPercent}%`, width: `${widthPercent}%`}}
          active={edit.id === activeEditId}
          onClick={e => onEdit(e, edit)}
        >
          <CommandIcon src={`/images/${edit.command}-icon.svg`} />
          <DragGrip
            src="/images/drag-grip.png"
            style={{left: 0}}
            onDragStart={e => onDragStart(e, edit, "start")}
            onDrag={e => onDrag(e, edit, "start")}
            onDragEnd={e => onDragEnd(e, edit, "start")}
            draggable="true"
          />
          <DragGrip
            src="/images/drag-grip.png"
            style={{left: "100%", marginLeft: "-11px"}}
            onDragStart={e => onDragStart(e, edit, "end")}
            onDrag={e => onDrag(e, edit, "end")}
            onDragEnd={e => onDragEnd(e, edit, "end")}
            draggable="true"
          />
        </EditSegment>
      </>
    )
  }

  const tempTime = useRef(-1 as number);
  const tempStartX = useRef(-1 as number);
  const tempStartTime = useRef(-1 as number);

  function onDragStart(ev: any, edit: EditPoint, name: string) {
    tempStartX.current = ev.pageX;
    if (name === "start") {
      tempTime.current = edit.times.start;
    } else if (name === "end") {
      tempTime.current = edit.times.end;
    }
    document.ondragover = (e: any) => e.preventDefault();
    const segmentEl = ev.target.parentNode;
    segmentEl.style.backgroundColor = activeBg;
    segmentEl.style.borderColor = activeBorder;
  }

  function onDrag(ev: any, edit: EditPoint, name: string) {
    const segmentEl = ev.target.parentNode;
    
    const x = ev.pageX - tempStartX.current;
    const movementRatio = x / backgroundBarRef.current.clientWidth;
    const timeDelta = movementRatio * VideoConstants.timelineLength;
    if (name === "start") {
      const newTime = Math.max(0, edit.times.start + timeDelta);
      tempTime.current = newTime;
      const videoTimeRatio = newTime / VideoConstants.timelineLength;
      const newLeftPercent = videoTimeRatio * 100;
      segmentEl.style.left = `${newLeftPercent}%`;
      const widthPercent = 100 * (edit.times.end - newTime) / VideoConstants.timelineLength;
      segmentEl.style.width = `${widthPercent}%`;
    } else if (name === "end") {
      const newTime = Math.min(Math.max(0, edit.times.end + timeDelta), videoRef.current.duration);
      tempTime.current = newTime;
      const widthPercent = 100 * (newTime - edit.times.start) / VideoConstants.timelineLength;
      segmentEl.style.width = `${widthPercent}%`;
    }
  }

  function onDragEnd(ev: any, edit: EditPoint, name: string) {
    let times;

    if (name === "start") {
      times = { ...edit.times, start: tempTime.current };
    } else if (name === "end") {
      times = { ...edit.times, end: tempTime.current };
    }

    props.onUpdate({ ...edit, times });
  }

  function editsRendered() {
    if (!edits) return null

    return (
      <>
        {edits.map((edit: EditPoint, index: number) => <SingleEdit edit={edit} key={index} />)}
      </>
    )
  }

  function videoBarPercent() {
    if (!videoLoaded) return 100;
    const videoLength = videoRef.current.duration;
    return Math.min(100, 100 * videoLength / VideoConstants.timelineLength)
  }

  function videoBarWidth() {
    return `${videoBarPercent()}%`
  }

  function timelineClicked(ev: any) {
    const times = calculateTimes(ev);
    props.newEdit({ ...VideoConstants.initialEditPoint, times })
  }

  function calculateTimes(ev: any) {
    const x = ev.clientX - offset;
    const start = x / backgroundBarRef.current.clientWidth * VideoConstants.timelineLength;
    const nextEdit = nextEditAfterStart(start)
    const videoLength = videoRef.current.duration;
    const end = nextEdit ? nextEdit.times.start : videoLength;
    return { start, end };
  }

  function nextEditAfterStart(start: number) {
    const sortedEdits = edits.sort((a: any, b: any) => a.times.start - b.times.start)
    return sortedEdits.find((e) => e.times.start > start)
  }

  return (
    <BarBackground ref={backgroundBarRef} onClick={onSetCurrentTime}>
      <Bar ref={barRef} style={{width: videoBarWidth(), position: "absolute", top: 0}} />
      {playHeadIndicator()}
      {editsRendered()}
      {hovering && <EditSegment ref={pointerRef}>&nbsp;</EditSegment>}
    </BarBackground>
  )
}
