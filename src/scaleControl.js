function applyScale(context) {
  const { scaleControl, video, edits } = context
  const currentTime = video.currentTime
  const amount = 50
  const edit = {
    command: "scale",
    time: [currentTime, currentTime],
    arguments: { amount: amount },
  }
  edits.push(edit)
  console.log("updated edits", edits)
  scaleControl.classList.add("hidden")
}

export default function scaleControl(globalContext) {
  const { video, edits } = globalContext
  const scaleControl = document.getElementById("scale-control")
  const context = { video, scaleControl, edits }
  video.pause()
  scaleControl.classList.remove("hidden")
  const applyBtn = scaleControl.getElementsByClassName("apply")[0]
  applyBtn.addEventListener("click", () => applyScale(context))
}
