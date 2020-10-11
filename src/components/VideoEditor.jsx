import React, { useState } from "react"
import ScaleControl from "./ScaleControl"
import { state, updateState } from "./../state"

export default function VideoEditor() {
  const [currentControl, setCurrentControl] = useState(null)

  function openControl(name) {
    const video = document.getElementById("video")
    video.pause()
    setCurrentControl(name)
  }

  function onEditSaved(edit) {
    updateState({ edits: [...state.edits, edit] })
    console.log("updated edits", state.edits)
    setCurrentControl(null)
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

      {currentControl === "scale" && <ScaleControl onSave={onEditSaved} />}
    </>
  )
}
