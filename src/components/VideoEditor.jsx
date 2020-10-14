import React, { useState } from "react"
import PointEditor from "./PointEditor"
import PointsBar from "./PointsBar"

const initialEditPoint = {
  command: null,
  times: { start: null, end: null },
  arguments: {},
}

const videoRef = React.createRef()

export default function VideoEditor() {
  const [edits, setEdits] = useState([])
  const [editPoint, setEditPoint] = useState(initialEditPoint)
  const videoEl = videoRef.current
  const videoDuration = videoEl && videoEl.duration

  function openControl() {
    const video = videoRef.current
    const times = { start: video.currentTime, end: null }
    setEditPoint({ ...editPoint, command: "scale", times })
  }

  function onEditSaved(edit) {
    const updatedEdits = [...edits, editPoint]
    setEdits(updatedEdits)
    console.log("updated edits", updatedEdits)
    setEditPoint(initialEditPoint)
  }

  function markEnd() {
    const video = document.getElementById("video")
    const times = { ...editPoint.times, end: video.currentTime }
    setEditPoint({ ...editPoint, times })
  }

  return (
    <>
      <video
        controls
        id="video"
        style={{ width: "100%", maxWidth: "960px" }}
        ref={videoRef}
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
        videoDuration={videoDuration}
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
