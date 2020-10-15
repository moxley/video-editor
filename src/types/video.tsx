export interface EditPoint {
  command: string | null;
  id: string | null;
  times: TimeSegment;
  arguments: any;
}

export interface TimeSegment {
  start: null | number;
  end: null | number;
}
