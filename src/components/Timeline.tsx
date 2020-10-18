import React, { useRef, useState } from "react"
import styled from 'styled-components'
import { EditPoint } from "../types/video"
import VideoConstants from "../lib/VideoConstants";

const BarBackground = styled.div`
  height: 80px;
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
  &:hover { cursor: pointer; }
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
  opacity: 0.5;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

const PlayHeadDragSurface = styled.div`
  position: absolute;
  top: 0;
  padding: 0 6px;
  margin-left: -6px;
  height: 100%;
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
  const [videoState, setVideoState] = useState({ playHead: 0 })
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
    if (videoState.playHead === null) return null
    const percent = (videoState.playHead / VideoConstants.timelineLength) * 100

    return (
      <div style={{position: "relative", left: `${percent}%`, width: "40px", height: "100%"}}>
        <PlayHeadDragSurface>
          <div
            style={{
              height: "100%",
              backgroundColor: "#faa",
              position: "absolute",
              width: "2px",
              top: "1px",
            }}
          />
        </PlayHeadDragSurface>
        <AddButton src="/images/add-btn.svg" onClick={onAdd} />
      </div>
    )
  }

  function onAdd(ev: any) {
    ev.preventDefault();
    ev.stopPropagation();
    const time = videoState.playHead;
    const matchingEdit = edits.find(({ times }: EditPoint) => {
      const afterStart = time >= times.start;
      const beforeEnd = time <= times.end;
      return afterStart && beforeEnd
    })
    const nextSegment = nextEditAfterStart(time);
    const nextStart = nextSegment && nextSegment.times.start || null;
    const videoEl = videoRef.current;
    if (matchingEdit) {
      const times = { start: time, end: nextStart || videoEl.duration }
      const newEdit = { ...VideoConstants.initialEditPoint, times };
      const updatedEdit = { ...matchingEdit, times: { ...matchingEdit.times, end: time }}
      props.onSplit(updatedEdit, newEdit);
    } else {
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
            draggable
          />
          <DragGrip
            src="/images/drag-grip.png"
            style={{left: "100%", marginLeft: "-11px"}}
            onDragStart={e => onDragStart(e, edit, "end")}
            onDrag={e => onDrag(e, edit, "end")}
            onDragEnd={e => onDragEnd(e, edit, "end")}
            draggable
          />
        </EditSegment>
      </>
    )
  }

  const tempTime = useRef(-1 as number);
  const tempStartX = useRef(-1 as number);
  const minStartTime = useRef(0);
  const maxEndTime = useRef(0);

  function onDragStart(ev: any, edit: EditPoint, name: string) {
    tempStartX.current = ev.pageX;
    if (name === "start") {
      const time = edit.times.start;
      tempTime.current = time;
      minStartTime.current = getMinStartTime(time);
    } else if (name === "end") {
      const time = edit.times.end;
      tempTime.current = time;
      maxEndTime.current = getMaxEndTime(time);
    }
    document.ondragover = (e: any) => e.preventDefault();
    const segmentEl = ev.target.parentNode;
    segmentEl.style.backgroundColor = activeBg;
    segmentEl.style.borderColor = activeBorder;
  }

  function getMinStartTime(time: number) {
    const leftEdit = sortEdits().reverse().find(({ times: { end }}: any) => end <= time)
    return leftEdit && leftEdit.times.end || 0;
  }

  function getMaxEndTime(time: number) {
    const rightEdit = sortEdits().find(({ times: { start }}: any) => start >= time)
    return rightEdit && rightEdit.times.start || 0;
  }

  function onDrag(ev: any, edit: EditPoint, name: string) {
    const segmentEl = ev.target.parentNode;
    const x = ev.pageX - tempStartX.current;
    const movementRatio = x / backgroundBarRef.current.clientWidth;
    const timeDelta = movementRatio * VideoConstants.timelineLength;

    if (name === "start") {
      const newTime = Math.min(
        edit.times.end,
        Math.max(
          minStartTime.current,
          edit.times.start + timeDelta
        )
      );
      tempTime.current = newTime;
      const videoTimeRatio = newTime / VideoConstants.timelineLength;
      const newLeftPercent = videoTimeRatio * 100;
      segmentEl.style.left = `${newLeftPercent}%`;
      const widthPercent = 100 * (edit.times.end - newTime) / VideoConstants.timelineLength;
      segmentEl.style.width = `${widthPercent}%`;
    } else if (name === "end") {
      const newTime = Math.min(
        Math.max(edit.times.start, edit.times.end + timeDelta),
        maxEndTime.current || videoRef.current.duration
      );
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

    minStartTime.current = -1;

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
    return sortEdits().find(e => e.times.start > start)
  }

  function sortEdits() {
    return edits.sort((a: any, b: any) => a.times.start - b.times.start)
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
