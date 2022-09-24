import React, {
	CSSProperties,
	FunctionComponent,
	useCallback,
	useRef,
} from 'react'
import { MoreThanClickCallback, useMoreThanClick } from '../useMoreThanClick'

export const Example: FunctionComponent = () => {
	const ref = useRef<HTMLButtonElement>(null)
	const handleDoubleClickOrLongPress = useCallback<MoreThanClickCallback>(
		(type) => {
			alert(`User performed ${type}.`)
		},
		[],
	)
	const { progress } = useMoreThanClick(ref, handleDoubleClickOrLongPress)

	return (
		<button
			className="example-button"
			style={
				{
					['--progress']: progress,
				} as CSSProperties
			}
			ref={ref}
		>
			Click me
		</button>
	)
}
