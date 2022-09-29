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

## Development

Run `npm start` and `npm run storybook` parallelly.
