import React, { useRef, useState } from "react"
import PointEditor from "./PointEditor"
import PointsBar from "./PointsBar"
import { EditPoint, TimeSegment } from "../types/video"

const initialEditPoint: EditPoint = {
  command: null,
  times: { start: null, end: null },
  arguments: {},
};

export default function VideoEditor() {
  const [edits, setEdits]: [EditPoint[], (value: EditPoint[]) => void] = useState([] as EditPoint[])
  const [editPoint, setEditPoint]: [EditPoint, (value: EditPoint) => void] = useState(initialEditPoint)
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  function setVideoRef(videoEl: any) {
    if (!videoEl) return
    if (videoRef.current) return
    videoRef.current = videoEl

    // videoEl.addEventListener("play", (time: any) => {
    //   setVideoState({ playHead: time, duration: videoEl.duration })
    // })

    setPlaying(true)
  }

  function openControl() {
    const video = document.getElementById("video") as any;
    const times: TimeSegment = { start: video.currentTime, end: null }
    setEditPoint({ ...editPoint, command: "scale", times })
  }

  function onEditSaved(edit: EditPoint) {
    const updatedEdits = [...edits, editPoint]
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
  }

  return (
    <>
      <video
        controls
        id="video"
        style={{ width: "100%", maxWidth: "960px" }}
        ref={setVideoRef}
      >
        <source
          src="https://embedwistia-a.akamaihd.net/deliveries/aff5dbbb15cde4c917a1094efabe69a97ddb7d8b/Hackathon.mp4"
          type="video/mp4"
        />
        Sorry, your browser doesn't support embedded videos.
      </video>

      <PointsBar
        edits={edits}
        editPoint={editPoint}
        videoRef={videoRef}
        playing={playing}
        onEdit={onEdit}
      />

      <div>
        <button onClick={openControl}>Mark edit start</button>
        {editPoint.times.start && (
          <button onClick={markEnd}>Mark edit end</button>
        )}
      </div>

      {editPoint.command && (
        <PointEditor editPoint={editPoint} onSave={onEditSaved} />
      )}
    </>
  )
}
