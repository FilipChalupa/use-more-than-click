import React, { FunctionComponent, useCallback, useRef } from 'react'
import { MoreThanClickCallback, useMoreThanClick } from '../useMoreThanClick'

export const Example: FunctionComponent = () => {
	const ref = useRef<HTMLButtonElement>(null)
	const handleDoubleClickOrLongPress = useCallback<MoreThanClickCallback>(
		(type) => {
			alert(`User performed ${type}.`)
		},
		[],
	)
	useMoreThanClick(ref, handleDoubleClickOrLongPress)

	return <button ref={ref}>Click me</button>
}
