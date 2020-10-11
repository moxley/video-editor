import "./style.css"
import scaleControl from "./scaleControl"

document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("video")
  const btn = document.getElementById("current-time-btn")
  btn.addEventListener("click", () => scaleControl(video))
})
