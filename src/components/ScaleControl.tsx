import React from "react"

export default function ScaleControl(props: any) {
  function applyChanges() {
    const video = document.getElementById("video") as any

    const currentTime = video.currentTime
    const amount = 50
    const edit = {
      command: "scale",
      time: { start: currentTime, end: currentTime },
      arguments: { amount: amount },
    }

    props.onSave && props.onSave(edit)
  }

  return (
    <div id="scale-control">
      <h2>Scale</h2>
      <div className="radio-group">
        <input type="radio" name="amount" value="50" id="scale-50-percent" />
        <label htmlFor="scale-50-percent">50%</label>

        <input type="radio" name="amount" value="150" id="scale-150-percent" />
        <label htmlFor="scale-150-percent">150%</label>

        <button className="apply" onClick={applyChanges}>
          Apply
        </button>
      </div>
    </div>
  )
}
