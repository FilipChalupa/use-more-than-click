import { RefObject, useEffect, useMemo, useState } from 'react'
import { handleMoreThanClick } from './handleMoreThanClick'

export type MoreThanClickType = 'double-click' | 'long-press'

export type MoreThanClickCallback = (type: MoreThanClickType) => void

export const useMoreThanClick = (
	ref: RefObject<HTMLElement>,
	actionHandler: MoreThanClickCallback,
) => {
	const [progress, setProgress] = useState(0)

	useEffect(() => {
		if (ref.current === null) {
			return
		}

		const handler = handleMoreThanClick(
			ref.current,
			actionHandler,
			(progress) => {
				setProgress(progress)
			},
		)

		return () => {
			handler.destroy()
		}
	}, [ref])

	return useMemo(() => ({ progress }), [progress])
}
