# Video Editor

## Instructions

Running the video editor requires NodeJS with NPM. I used Node v10.16.0 and NPM v6.9.0.

After cloning the repository and changing directory to the root of the
repository, run the following:

```
npm install
```

If you get errors in the output that include `gyp: No Xcode or CLT version detected!`, try running
`npm install` again.

Run the the frontend application by executing the following:

```
npm start
```

Then open a browser to http://localhost:8080/

## Edit Points Format

In this application, an edit point is a JSON object that includes the fields `command`, `time`, and `arguments`.

The "command and arguments" pattern is well-established. It is used in programming languages
and operating shell commands. The edit point's `times` field is appropriate for time-based media.

For sending the edits points to the backend, I would wrap them inside an object, so that
metadata can be added.

JSON is the chosen format data encoding. It is widely supported by popular databases, frontend
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

## Omissions

UX details such as:

- The left and ride sides of the edit point bars don't line up with the video's playhead. It's off by a pixel or two.
- It would be nicer if when adjusting the start time of an edit, that the video playhead also changed with it.
- When dragging the edit point start or end times, the draggable element becomes cloned, and one of the clones moves independently.
  It would be better if there was no cloning and the movement was constrained to a horizontal axis.
- The instructions called for creating an edit point when clicking on the timeline. I opted instead to adjust the video
  playhead to the point that was clicked. Having an edit point be created seemed like it might get annoying
  for the use case where the user just wants to find a specific spot in the video. So instead, if the user wants to
  create an edit point, they can click a "plus" icon next to the playhead. It requires two clicks instead of one.

I chose React because I'm familiar with it. I started by using no framework, but then ran into problems managing
event handlers. Eventually, Typescript was introduced to help manage evolving changes in the data types being passed
between components.

## What I Learned

I'd never built software that worked with videos before, so that was new. Most of what I learned was the `<video>` DOM API. I had built an image editor using
similar technologies. That experience proved to be helpful.

The web frontend hasn't been a primary skill used in my day job since 2011. However, I started learning React starting around 2016, and I used it extensively in a side project from 2018 to the present. Part of that experience included learning Typescript. During that time, I learned enough NPM, Webpack and Babel to get the job done, but I still don't feel confident with those technologies.

## Decisions

The 145 second value required for the timeline bar was a bit of a problem. It wasn't clear whether that value was chosen to keep the assignment
simple, or if it was supposed to be a product requirement. I assumed the latter, becuase the value didn't make the assignment more simple.
The video I tested with was less than 145 seconds, so the area representing the video timeline was much narrower than the bar itself.
The result was a little awkward.

## Additional Thoughts

I was told to work only on either the frontend task or the backend task, and that I should choose the task that I have less experience with.
That's why I chose the frontend task.

The assignment took a very long time to complete for a code evaluation. I could have spent less time on it, but I wouldn't have been satisfied
with the result. I shot for a solution that got 80% of the way to a finished product (minus actually applying the edits the video).
Anything less in front of a real customer would have been uncomfortable.
