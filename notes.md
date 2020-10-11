# Notes

# Soapbox Tech Assessment

- Never did anything with video streaming or editing before
- I have done in-browser photo editing
- Early steps will involve research on doing in-browser video editing.
- Focus on the overall architecture first, then shift to the browser API

The "edit points" are stored in a file format on the backend. A backend function will take the
edit points and the original video, then create a new video with the edits applied.

## Architecture and Main Flow

- User's raw video is stored on their computer's storage (this might be a mobile device).
- User uploads the raw video into a web form provided by the app's web UI.
- The raw video is uploaded to the backend.
- After upload, the backend makes a URL available where the video can be streamed from.
- The web UI displays the video from the URL, starting in a paused state.
- The user provides "edit points" which is just data that gets saved to the backend.
- When editing is complete, the user requests for a new video to be rendered.
- The backend applies video transforms based on the original video file and the edit points.
  The result is a new video file. This is made available to the user.

Question: Is there a difference between "streaming" and regular "downloading"? Research into this can
be done later. We will assume for now that the resource returned from a video URL is a whole video file.

This is the architecture that will be attempted at first. If my assumptions prove to
be incorrect, adjustments to the architecture can be made.

## Browser API

The first objective is to implement a minimal video player.

Web browsers provide a `<video>` tag. There is also an `<embed>` tag, but that tag
is deprecated.

- [x] Initial HTML document
- [x] Play sample video 1
- [ ] Custom video controls

### Try out web-based video player:

```
open index.html
```

## Edit Points Format

An edit point will consist of a "command" and "arguments", much like a function call or
a shell command. The edit points format will consist of a list of edit points.

The "command" and "arguments" pattern is well-established, and there doesn't seem to be
a good reason to deviate from that pattern.

The edit points will be wrapped in a key-value data structure (e.g., a JSON object), so that
metadata can be added to the format outsides of the edit points.

JSON will be chosen for the data encoding. It is widely supported by popular databases. YAML
and TOML have better features for hand-coding, but hand-coding isn't something that is
needed in this architecture. JSON can be hand-coded too. BSON is used to solve data exchange
problems, specifically throughput and latency concerns. It's downsides are lack of readability
and lack of tooling support. Its performance characterists are not needed for this architecture.
All other formats I'm familiar with don't have beneficial features for this architecture.
