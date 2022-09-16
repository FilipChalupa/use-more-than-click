import { RefObject, useCallback, useEffect, useMemo, useState } from 'react'

export type MoreThanClickCallback = (
	type: 'double-click' | 'long-press',
) => void

export const useMoreThanClick = (
	ref: RefObject<HTMLElement>,
	actionHandler: MoreThanClickCallback,
) => {
	const [progress, setProgress] = useState(0)
	const handleClick = useCallback(() => {
		actionHandler('double-click') // @TODO: this is not double click yet
		setProgress(1)
	}, [actionHandler])

	useEffect(() => {
		const element = ref.current
		if (element === null) {
			return
		}

		// @TODO: handle double click and long press
		element.addEventListener('click', handleClick)

		return () => {
			element.removeEventListener('click', handleClick)
		}
	}, [ref, handleClick])

	return useMemo(() => ({ progress }), [progress])
}
