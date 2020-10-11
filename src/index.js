import "./style.css"
import { state } from "./state"
import React from "react"
import ReactDOM from "react-dom"
import VideoEditor from "./components/VideoEditor"

ReactDOM.render(<VideoEditor />, document.getElementById("app"))
module.hot.accept()

const context = { edits: state.edits, video: null }
window.appContext = context
