function applyScale(context) {
  const { scaleControl, video } = context
  const currentTime = video.currentTime
  const amount = 50
  const edit = {
    command: "scale",
    time: [currentTime, currentTime],
    arguments: { amount: amount },
  }
  console.log("applied edit", edit)
  scaleControl.classList.add("hidden")
}

export default function scaleControl(video) {
  const scaleControl = document.getElementById("scale-control")
  const context = { video, scaleControl }
  video.pause()
  scaleControl.classList.remove("hidden")
  const applyBtn = scaleControl.getElementsByClassName("apply")[0]
  applyBtn.addEventListener("click", () => applyScale(context))
}
