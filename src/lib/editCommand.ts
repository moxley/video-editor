import { EditPoint } from "../types/video";

export function hasEndTime(edit: EditPoint) {
  return edit.command !== "scale";
}
