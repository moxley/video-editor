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
  box-sizing: border-box;
`;

const Bar = styled.div`
  height: 100%;
  background-color: #fff;
  border: 1px solid #aaa;
  position: relative;
  box-sizing: border-box;
`;

const EditSegment = styled.div`
  width: 100px;
  height: 100%;
  background-color: #fda;
  border: 2px solid #fa0;
  border-width: 0 2px;
  position: absolute;
  top: 0;
  box-sizing: border-box;
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

  function SingleEdit(p: any) {
    const { edit } = p

    const { times } = edit
    if (times.start === null) return null

    const startPercent = (times.start / VideoConstants.timelineLength) * 100
    const widthPercent = ((times.end - times.start) / VideoConstants.timelineLength) * 100;

    return (
      <EditSegment
        style={{left: `${startPercent}%`, width: `${widthPercent}%`, cursor: "grabbing"}}
        onClick={() => props.onEdit(edit)}
      >
        &nbsp;
      </EditSegment>
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
      {hovering && <EditSegment ref={pointerRef}>&nbsp;</EditSegment>}
    </BarBackground>
  )
}
