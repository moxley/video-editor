import React, { useState } from "react"
import ScaleControl from "./ScaleControl"

const initialEditPoint = {
  command: null,
  times: [null, null],
  arguments: {},
}

export default function VideoEditor() {
  const [edits, setEdits] = useState([])
  const [editPoint, setEditPoint] = useState(initialEditPoint)

  function openControl(name) {
    const video = document.getElementById("video")
    video.pause()
    setEditPoint({ ...editPoint, command: name })
  }

  function onEditSaved(edit) {
    const updatedEdits = [...edits, editPoint]
    setEdits(updatedEdits)
    console.log("updated edits", updatedEdits)
    setEditPoint(initialEditPoint)
  }

  return (
    <>
      <video controls width="500" id="video">
        <source
          src="https://embedwistia-a.akamaihd.net/deliveries/aff5dbbb15cde4c917a1094efabe69a97ddb7d8b/Hackathon.mp4"
          type="video/mp4"
        />
        Sorry, your browser doesn't support embedded videos.
      </video>

      <div>
        <button id="open-scale-btn" onClick={() => openControl("scale")}>
          Scale...
        </button>
      </div>

      {editPoint.command === "scale" && <ScaleControl onSave={onEditSaved} />}
    </>
  )
}
