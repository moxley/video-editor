# Video Editor

## Setup

After cloning the repository and changing directory to the root of the
repository, run the following:

```
npm install
```

If you get errors in the output that include `gyp: No Xcode or CLT version detected!`, try running
`npm install` again.

Run the the frontend application execute the following:

```
npm start
```

Then open a browser to http://localhost:8080/

## Edit Points Format

An edit point is an object that includes the fields "command", "time", and "arguments".
The edit points format for a video consists of a list of edit points.

The "command" and "arguments" pattern is well-established. It is seen in programming languages
and operating shell commands. The "times" field is appropriate for time-based media.

The edit points list will be wrapped inside a key-value data structure (e.g., a JSON object), so that
metadata can be added to the format outsides of the edit points.

JSON will be chosen for the data encoding. It is widely supported by popular databases, frontend
APIs and backend APIs. YAML and TOML have better features for hand-coding,
but hand-coding isn't something that is
needed in this architecture. JSON can be hand-coded too. BSON is used to solve data exchange
problems, specifically throughput and latency concerns. It's downsides are lack of readability
and lack of tooling support. Its performance characterists are not needed for this architecture.
None of the formats I'm familiar with have beneficial features for this architecture.

Example edit points payload:

```json
{
  "edits": [
    {
      "command": "scale",
      "times": { "start": "00:10:00.000", "end": "00:11:10.000" },
      "arguments": { "amount": 150 }
    },
    {
      "command": "cut",
      "times": { "start": "00:12:00.000", "end": "00:12:30.000" },
      "arguments": {}
    }
  ]
}
```
