import React, { useRef, useState } from "react"
import styled from 'styled-components'
import { EditPoint } from "../types/video"
import VideoConstants from "../lib/VideoConstants";

const BarBackground = styled.div`
  height: 60px;
  margin-bottom: 1em;
  margin-top: 0.5em;
  position: relative;
  &:hover {
    cursor: pointer;
  }
`;

const Bar = styled.div`
  height: 100%;
  background-color: #fff;
  border: 1px solid #aaa;
  position: relative;
`;

const StartIndicator = styled.div`
  width: 4px;
  height: 69px;
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

  function startIndicator(edit: EditPoint) {
    const { times } = edit
    if (times.start === null) return null

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
          width: "69px",
          height: "100%",
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
    const times = { ...editPoint.times, start };
    props.onEdit({ ...editPoint, times })
  }

  return (
    <BarBackground ref={backgroundBarRef} onClick={timelineClicked}>
      <Bar ref={barRef} style={{width: videoBarWidth(), position: "absolute", top: 0}} />
      {playHeadIndicator()}
      {editsRendered()}
      {hovering && <StartIndicator ref={pointerRef}>&nbsp;</StartIndicator>}
    </BarBackground>
  )
}
