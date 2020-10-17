import { EditPoint } from "../types/video";

const initialEditPoint: EditPoint = {
  arguments: {},
  command: null,
  id: null,
  times: { start: 0, end: null },
};

const VideoConstants = {
  timelineLength: 145,
  initialEditPoint
} as any;

export default VideoConstants;
