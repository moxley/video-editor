import React, { useRef, useState } from "react"
import PointEditor from "./PointEditor"
import Timeline from "./Timeline"
import { EditPoint, TimeSegment } from "../types/video"
import { guid } from "../lib/idGenerator";
import { hasEndTime } from "../lib/editCommand";

const initialEditPoint: EditPoint = {
  arguments: {},
  command: null,
  id: null,
  times: { start: 0, end: null },
};

interface VideoState {
  playing: boolean;
  loaded: boolean;
}

const initialVideoState: VideoState = {
  playing: false,
  loaded: false
}

export default function VideoEditor() {
  const [edits, setEdits]: [EditPoint[], (value: EditPoint[]) => void] = useState([] as EditPoint[])
  const [editPoint, setEditPoint]: [EditPoint, (value: EditPoint) => void] = useState(initialEditPoint)
  const videoRef = useRef(null)
  const [videoState, setVideoState]: [VideoState, (value: VideoState) => void] = useState(initialVideoState);
  const [showEditPointsData, setShowEditPointsData]: [boolean, (value: boolean) => void] = useState(false as boolean);

  function setVideoRef(videoEl: any) {
    if (!videoEl) return
    if (videoRef.current) return
    videoRef.current = videoEl
    videoRef.current.addEventListener("canplay", () => {
      // videoEl.addEventListener("play", (time: any) => {
      //   setVideoState({ playHead: time, duration: videoEl.duration })
      // })

      setVideoState({loaded: true, playing: true});
    })
  }

  function openControl() {
    const video = document.getElementById("video") as any;
    const times: TimeSegment = { start: video.currentTime, end: null }
    setEditPoint({ ...editPoint, command: "scale", times })
  }

  function onEditSaved(edit: EditPoint) {
    let updatedEdits

    if (edit.id) {
      updatedEdits = edits.map(e => e.id === edit.id ? edit : e)
    } else {
      const id = guid()
      updatedEdits = [...edits, { ...edit, id }]
    }

    setEdits(updatedEdits)
    setEditPoint(initialEditPoint)
  }

  function markEnd() {
    const video = document.getElementById("video") as any
    const times = { ...editPoint.times, end: video.currentTime }
    setEditPoint({ ...editPoint, times })
  }

  function onEdit(edit: EditPoint) {
    setEditPoint(edit);
    if (edit.times.start !== null) {
      const video = videoRef.current;
      video.currentTime = edit.times.start
    }
  }

  function editPointsDisplay() {
    if (!showEditPointsData) return null;
    if (edits.length === 0) return <>(no edit points)</>
    return edits.map((e, index) => {
      return <div key={index}>
          {JSON.stringify(e)}
        </div>
    })
  }

  return (
    <div style={{ maxWidth: "960px" }}>
      <video
        controls
        id="video"
        ref={setVideoRef}
        style={{ width: "100%" }}
      >
        <source
          src="https://embedwistia-a.akamaihd.net/deliveries/aff5dbbb15cde4c917a1094efabe69a97ddb7d8b/Hackathon.mp4"
          type="video/mp4"
        />
        Sorry, your browser doesn't support embedded videos.
      </video>

      <Timeline
        edits={edits}
        editPoint={editPoint}
        videoRef={videoRef}
        playing={videoState.playing}
        onEdit={onEdit}
        videoLoaded={videoState.loaded}
      />

      <div>
        <button onClick={openControl}>Mark edit start</button>
        {hasEndTime(editPoint) && editPoint.times.start && (
          <button onClick={markEnd}>Mark edit end</button>
        )}
      </div>

      <PointEditor editPoint={editPoint} onSave={onEditSaved} />

      <div style={{marginTop: "1em"}}>
        <div>
          <button onClick={() => setShowEditPointsData(!showEditPointsData)}>{showEditPointsData ? "Hide" : "Show"} edit points data</button>
        </div>
        {editPointsDisplay()}
      </div>
    </div>
  )
}
