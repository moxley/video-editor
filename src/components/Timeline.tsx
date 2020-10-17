import React, { useRef, useState } from "react"
import styled from 'styled-components'
import { EditPoint, TimeSegment } from "../types/video"
import VideoConstants from "../lib/VideoConstants";

const BarBackground = styled.div`
  height: 60px;
  margin-bottom: 1em;
  margin-top: 0.5em;
  position: relative;
  box-sizing: border-box;
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

const EditSegment = styled.div`
  width: 100px;
  height: 100%;
  background-color: #fda;
  position: absolute;
  top: 0;
  box-sizing: border-box;
`;

const EditPointEl = styled.div`
  background-color: #fa0;
  width: 2px;
  position: absolute;
  top: 0;
  height: 100%;
  &:hover {
    cursor: grab;
  }
`;

const EditClickControl = styled.div`
  position: absolute;
  bottom: 0;
  border: 1px solid #ccc;
  border-width: 1px 1px 0 0;
  padding: 0.25em 0.5em;
  border-radius: 0 5px 0 0;
  &:hover {
    cursor: pointer;
  }
`;

const DragGrip = styled.img`
  position: absolute;
  bottom: 30px;
  left: 0;
  &:hover {
    cursor: pointer;
  }
`;

interface Props {
  onEdit: (edit: EditPoint) => void;
  onUpdate: (edit: EditPoint) => void;
  newEdit: (edit: EditPoint) => void;
  videoRef: any;
  videoLoaded: boolean;
  edits: EditPoint[];
  playing: boolean;
}

export default function Timeline(props: Props) {
  const { videoLoaded, videoRef, edits } = props
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
      <div
        style={{
          height: "100%",
          backgroundColor: "#faa",
          position: "relative",
          width: "2px",
          top: "1px",
          left: `${percent}%`,
        }}
      ></div>
    )
  }

  function SingleEdit(p: any) {
    const { edit } = p

    const { times } = edit
    if (times.start === null) return null

    const startPercent = (times.start / VideoConstants.timelineLength) * 100
    const endPercent = (times.end / VideoConstants.timelineLength) * 100
    const widthPercent = ((times.end - times.start) / VideoConstants.timelineLength) * 100;

    return (
      <>
        <EditSegment
          style={{left: `${startPercent}%`, width: `${widthPercent}%`}}
          onClick={() => props.onEdit(edit)}
        >
          &nbsp;
        </EditSegment>
        <EditPointEl style={{left: `${startPercent}%`}} onClick={() => props.onEdit(edit)} />
        <DragGrip
          src="/images/drag-grip.png"
          style={{left: `${startPercent}%`}}
          onDragStart={(e) => onDragStart(e, edit, "start")}
          onDrag={(e: any) => onDrag(e, edit, "start")}
          onDragEnd={(e: any) => onDragEnd(e, edit, "start")}
          draggable="true"
        />
        <DragGrip
          src="/images/drag-grip.png"
          style={{left: `${endPercent}%`, marginLeft: "-11px"}}
          onDragStart={(e) => onDragStart(e, edit, "end")}
          onDrag={(e: any) => onDrag(e, edit, "end")}
          onDragEnd={(e: any) => onDragEnd(e, edit, "end")}
          draggable="true"
        />
        <EditClickControl style={{left: `${startPercent}%`}} onClick={() => props.onEdit(edit)}>edit</EditClickControl>
        <EditPointEl
          style={{left: `${endPercent}%`}}
          onDragStart={(e) => onDragStart(e, edit, "end")}
          onDrag={(e: any) => onDrag(e, edit, "end")}
          onDragEnd={(e: any) => onDragEnd(e, edit, "end")}
          draggable="true"
        />
      </>
    )
  }

  const tempTime = useRef(-1 as number);
  const tempStartX = useRef(-1 as number);

  function onDragStart(ev: any, edit: EditPoint, name: string) {
    tempStartX.current = ev.pageX;
    document.ondragover = (e: any) => e.preventDefault();
  }

  function onDrag(ev: any, edit: EditPoint, name: string) {
    const x = ev.pageX - tempStartX.current;
    const movementRatio = x / backgroundBarRef.current.clientWidth;
    const timeDelta = movementRatio * VideoConstants.timelineLength;
    if (name === "start") {
      tempTime.current = Math.max(0, edit.times.start + timeDelta);
    } else if (name === "end") {
      tempTime.current = Math.max(0, edit.times.end + timeDelta);
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
    const x = ev.clientX - offset;
    const start = x / backgroundBarRef.current.clientWidth * VideoConstants.timelineLength;
    const sortedEdits = edits.sort((a: any, b: any) => a.times.start - b.times.start)
    const nextEdit = sortedEdits.find((e) => e.times.start > start)
    const videoLength = videoRef.current.duration;
    const end = nextEdit ? nextEdit.times.start : videoLength;
    const times = { start, end };
    props.newEdit({ ...VideoConstants.initialEditPoint, times })
  }

  return (
    <BarBackground ref={backgroundBarRef}>
      <Bar ref={barRef} style={{width: videoBarWidth(), position: "absolute", top: 0}} onClick={timelineClicked}/>
      {playHeadIndicator()}
      {editsRendered()}
      {hovering && <EditSegment ref={pointerRef}>&nbsp;</EditSegment>}
    </BarBackground>
  )
}
