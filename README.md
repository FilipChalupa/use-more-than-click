# React use more than click [![npm](https://img.shields.io/npm/v/use-more-than-click.svg)](https://www.npmjs.com/package/use-more-than-click) ![npm type definitions](https://img.shields.io/npm/types/use-more-than-click.svg)

Handles double clicks and long presses on buttons.

![example](https://raw.githubusercontent.com/FilipChalupa/use-more-than-click/HEAD/screencast.gif)

## Installation

```bash
npm install use-more-than-click
```

## How to use

You can get inspired by [Example here](src/stories/Example.tsx) and [Storybook demo here](https://use-more-than-click.netlify.app/).

```jsx
import { useMoreThanClick } from 'use-more-than-click'
import { useRef } from 'react'

const MyApp = () => {
	const ref = useRef(null)

	useMoreThanClick(ref, (actionType) => {
		alert(`You've performed ${actionType}.`)
	})

	return <button ref={ref}>Click me</button>
}
```

### Options

| name                       | description                                                                                                    | type                     | default |
| -------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------ | ------- |
| firstSingleClickProgress   | How much should the progress be set to after a first short click to indicate that more than click is expected. | `number` from `0` to `1` | `0.3`   |
| minimumHoldDuration        | How much time should pass while holding before assuming user is trying to hold.                                | `number` in milliseconds | `300`   |
| holdDurationToAction       | For how long should user hold to trigger action callback.                                                      | `number` in milliseconds | `800`   |
| decayDuration              | How long it takes to reset to initial state after unfinished hold.                                             | `number` in milliseconds | `1000`  |
| decayAfterActionDuration   | How long it takes to reset after triggered action.                                                             | `number` in milliseconds | `200`   |
| doubleClickMaximumInterval | Maximum accepted delay between first and second click to be identified as a double click.                      | `number` in milliseconds | `500`   |

## Development

Run `npm start` and `npm run storybook` parallelly.
