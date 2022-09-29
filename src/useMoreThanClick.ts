import { RefObject, useEffect, useMemo, useState } from 'react'
import { handleMoreThanClick } from './handleMoreThanClick'

export type MoreThanClickType = 'double-click' | 'long-press'

export type MoreThanClickCallback = (type: MoreThanClickType) => void

export const useMoreThanClick = (
	ref: RefObject<HTMLElement>,
	actionHandler: MoreThanClickCallback,
	options?: Parameters<typeof handleMoreThanClick>['3'],
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
			options,
		)

		return () => {
			handler.destroy()
		}
	}, [ref, actionHandler])

	return useMemo(() => ({ progress }), [progress])
}
