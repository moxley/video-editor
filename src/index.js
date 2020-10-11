import "./style.css"
import scaleControl from "./scaleControl"

const context = { edits: [], video: null }
window.appContext = context

document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("video")
  context.video = video
  const btn = document.getElementById("open-scale-btn")
  btn.addEventListener("click", () => scaleControl(context))
})
