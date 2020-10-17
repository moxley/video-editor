import React, { useRef, useState } from "react"
import styled from 'styled-components'
import { EditPoint } from "../types/video"
import VideoConstants from "../lib/videoConstants";

const BarBackground = styled.div`
  height: 10px;
  background-color: #000;
  margin-bottom: 1em;
  margin-top: 0.5em;
  position: relative;
  &:hover {
    cursor: none;
  }
`;

const Bar = styled.div`
  height: 10px;
  background-color: #888;
  position: relative;
`;

const StartIndicator = styled.div`
  width: 4px;
  height: 19px;
  background-color: rgb(216, 216, 0);
  top: -5px;
  position: absolute;
`;

interface Props {
  onEdit: (edit: EditPoint) => void;
  editPoint: EditPoint;
  videoRef: any;
  videoLoaded: boolean;
  edits: EditPoint[];
  playing: boolean;
}

export default function Timeline(props: Props) {
  const { editPoint, videoLoaded, videoRef, edits } = props
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
          height: "10px",
          backgroundColor: "#aaa",
          marginBottom: "1em",
          marginTop: "0.5em",
          position: "relative",
          width: `${percent}%`,
        }}
      ></div>
    )
  }

  function startIndicator(edit: EditPoint) {
    const { times } = edit
    const video = videoRef.current;
    if (!times.start) return null

    const startPercent = (times.start / VideoConstants.timelineLength) * 100

    return (
      <StartIndicator
        style={{left: `${startPercent}%`, cursor: "grabbing"}}
        onClick={() => props.onEdit(edit)}
      >
        &nbsp;
      </StartIndicator>
    )
  }

  function endIndicator(edit: EditPoint) {
    const { times } = edit
    if (!times.end) return null
    const percent = (times.end / VideoConstants.timelineLength) * 100
    return (
      <div
        style={{
          width: "4px",
          height: "19px",
          backgroundColor: "#0aa",
          top: "-5px",
          position: "absolute",
          left: `${percent}%`,
          cursor: "grabbing",
        }}
      >
        &nbsp;
      </div>
    )
  }

  function SingleEdit(props: any) {
    const { edit } = props

    return (
      <>
        {startIndicator(edit)}
        {endIndicator(edit)}
      </>
    )
  }

  function editsRendered() {
    if (!editPoint || !edits) return null
    
    return (
      <>
        <SingleEdit edit={editPoint} />
        {edits.map((edit: EditPoint, index: number) => <SingleEdit edit={edit} key={index} />)}
      </>
    )
  }

  function onMouseEnter(ev: any) {
    ev.target.onmousemove = (ev: any) => {
      const pointer = pointerRef.current;
      if (!pointer) return;
      const x = ev.clientX - offset;
      const xPercent = barPercent(x);
      if (xPercent < 0 || xPercent > 100) return;
      pointer.style.left = `${x}px`;
    }
    setHovering(true)
  }

  function barPercent(x: number) {
    return 100 * x / barRef.current.clientWidth;
  }

  function onMouseLeave(ev: any) {
    ev.target.onmousemove = null;
    setHovering(false)
  }

  function onMouseDown(ev: any) {
    let x = ev.clientX - offset;
    const bPercent = barPercent(x);
    if (bPercent > 100) x = x * 100 / bPercent;
    if (bPercent < 0) x = 0;
    const factor = x / backgroundBarRef.current.clientWidth;
    const start = VideoConstants.timelineLength * factor;
    videoRef.current.currentTime = start;

    props.onEdit({
      command: "scale",
      id: null,
      times: { start, end: null },
      arguments: {}
    })
  }

  function videoBarPercent() {
    if (!videoLoaded) return 100;
    const videoLength = videoRef.current.duration;
    return Math.min(100, 100 * videoLength / VideoConstants.timelineLength)
  }

  function videoBarWidth() {
    return `${videoBarPercent()}%`
  }

  return (
    <BarBackground onMouseEnter={onMouseEnter as any} onMouseLeave={onMouseLeave as any} onMouseDown={onMouseDown} ref={backgroundBarRef}>
      <Bar ref={barRef} style={{width: videoBarWidth(), position: "absolute", top: 0}} />
      {playHeadIndicator()}
      {editsRendered()}
      {hovering && <StartIndicator ref={pointerRef}>&nbsp;</StartIndicator>}
    </BarBackground>
  )
}
