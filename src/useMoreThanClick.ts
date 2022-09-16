import { RefObject, useCallback, useEffect } from 'react'

export type MoreThanClickCallback = (
	type: 'double-click' | 'long-press',
) => void

export const useMoreThanClick = (
	ref: RefObject<HTMLElement>,
	callback: MoreThanClickCallback,
) => {
	const handleClick = useCallback(() => {
		callback('double-click') // @TODO: this is not double click yet
	}, [])

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
}
