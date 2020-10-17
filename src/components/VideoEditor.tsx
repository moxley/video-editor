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
  const initialEditPoint = VideoConstants.initialEditPoint;
  const [edits, setEdits]: [EditPoint[], (value: EditPoint[]) => void] = useState([initialEditPoint] as EditPoint[])
  const videoRef = useRef(null)
  const [videoState, setVideoState]: [VideoState, (value: VideoState) => void] = useState(initialVideoState);
  const [showEditPointsData, setShowEditPointsData]: [boolean, (value: boolean) => void] = useState(false as boolean);
  const videoInitRef = useRef(false);
  const [editPoint, setEditPoint]: [EditPoint | null, (value: EditPoint | null) => void] = useState(null);

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

  function onUpdate(edit: EditPoint) {
    let updatedEdits

    if (edit.id) {
      updatedEdits = edits.map(e => e.id === edit.id ? edit : e)
      setEditPoint(edit)
    } else {
      const id = guid()
      const updatedEdit = { ...edit, id }
      updatedEdits = [...edits, updatedEdit ]
      setEditPoint(updatedEdit)
    }

    setEdits(updatedEdits)
  }

  function onEdit(edit: EditPoint) {
    if (edit.times.start !== null) {
      const video = videoRef.current;
      video.currentTime = edit.times.start
    }
    setEditPoint(edit)
  }

  function onDelete(edit: EditPoint) {
    const updatedEdits = edits.filter(e => e.id !== edit.id)
    setEdits(updatedEdits);
    setEditPoint(null)
  }

  function newEdit(edit: EditPoint) {
    const id = guid()
    const newEdit = {...edit, id}
    setEdits([...edits, newEdit])
    setEditPoint(newEdit)
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
        onUpdate={onUpdate}
        videoLoaded={videoState.loaded}
      />

      {editPoint && <PointEditor editPoint={editPoint} onSave={onUpdate} onDelete={onDelete} />}

      <div style={{marginTop: "1em"}}>
        <div>
          <button onClick={() => setShowEditPointsData(!showEditPointsData)}>{showEditPointsData ? "Hide" : "Show"} edit points data</button>
        </div>
        {editPointsDisplay()}
      </div>
    </div>
  )
}
