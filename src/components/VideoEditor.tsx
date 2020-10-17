import React, { useRef, useState } from "react"
import PointEditor from "./PointEditor"
import Timeline from "./Timeline"
import { EditPoint, TimeSegment } from "../types/video"
import { guid } from "../lib/idGenerator";
import VideoConstants from "../lib/VideoConstants";

interface VideoState {
  playing: boolean;
  loaded: boolean;
}

const initialVideoState: VideoState = {
  playing: false,
  loaded: false
}

export default function VideoEditor() {
  const [edits, setEdits]: [EditPoint[], (value: EditPoint[]) => void] = useState([VideoConstants.initialEditPoint] as EditPoint[])
  const videoRef = useRef(null)
  const [videoState, setVideoState]: [VideoState, (value: VideoState) => void] = useState(initialVideoState);
  const [showEditPointsData, setShowEditPointsData]: [boolean, (value: boolean) => void] = useState(false as boolean);
  const videoInitRef = useRef(false);

  function setVideoRef(videoEl: any) {
    if (!videoEl) return
    if (videoRef.current) return
    if (videoInitRef.current) return
    videoRef.current = videoEl
    videoRef.current.addEventListener("canplay", () => {
      if (videoInitRef.current) return
      videoInitRef.current = true;
      let edit = edits[edits.length - 1];
      const id = guid()
      edit = { ...edit, id }
      const leading = edits.slice(0, edits.length - 2);
      edit = putEndTimeToVideoDuration(edit);
      setEdits([...leading, edit]);
      setVideoState({loaded: true, playing: true});
    })
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
  }

  function onEdit(edit: EditPoint) {
    if (edit.times.start !== null) {
      const video = videoRef.current;
      video.currentTime = edit.times.start
    }
  }

  function newEdit(edit: EditPoint) {
    const id = guid()
    setEdits([...edits, {...edit, id}])
  }

  function putEndTimeToVideoDuration(edit: EditPoint) {
    if (edit.times.end === null) {
      const video = videoRef.current;
      const times = { ...edit.times, end: video.duration };
      return { ...edit, times }
    } else {
      return edit;
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

  const editPoint = edits[edits.length - 1];

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
        videoRef={videoRef}
        playing={videoState.playing}
        onEdit={onEdit}
        newEdit={newEdit}
        onUpdate={onEditSaved}
        videoLoaded={videoState.loaded}
      />

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
