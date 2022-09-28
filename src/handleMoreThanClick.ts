export type MoreThanClickType = 'double-click' | 'long-press'

const firstSingleClickProgress = 0.3
const minimumHoldDurationMilliseconds = 300
const holdDurationToActionMilliseconds = 800
const doubleClickMaximumIntervalMilliseconds = 500

const getNow = () => Date.now()

export const handleMoreThanClick = (
	element: HTMLElement,
	handleAction: (type: MoreThanClickType) => void = () => {},
	handleProgressChange: (progress: number) => void = () => {},
) => {
	let progress = 0
	let pressStart: {
		time: number
		progress: number
	} | null = null
	let clickedOnceAt: number | null = null
	let loopId: ReturnType<typeof requestAnimationFrame> | null = null

	const loop = () => {
		console.log('loop')
		if (progress === 0 && pressStart === null) {
			stopLoop()
			return
		}
		if (pressStart === null) {
			setProgress(progress - 0.01) // @TODO
		} else {
			const now = getNow()
			setProgress(
				pressStart.progress +
					(now - pressStart.time) / holdDurationToActionMilliseconds,
			)
		}
		loopId = requestAnimationFrame(loop)
	}

	const startLoopIfIdle = () => {
		if (loopId !== null) {
			return
		}
		loop()
	}

	const stopLoop = () => {
		if (loopId !== null) {
			cancelAnimationFrame(loopId)
			loopId = null
		}
	}

	const setProgress = (newProgress: number) => {
		const newProgressClamped = Math.min(1, Math.max(0, newProgress))
		if (newProgressClamped !== progress) {
			progress = newProgressClamped
			if (progress === 0) {
				clickedOnceAt = null
				console.log({ isClickedOnceAt: clickedOnceAt })
			}
			handleProgressChange(progress)
		}
	}

	const handleBeforeAction = (type: MoreThanClickType) => {
		handleAction(type)
		setProgress(0)
	}

	const handleClick = () => {
		console.log('handleClick')
		if (
			progress * holdDurationToActionMilliseconds <
			minimumHoldDurationMilliseconds
		) {
			// @TODO: ignore after double-click
			setProgress(firstSingleClickProgress)
		}
		if (
			clickedOnceAt !== null &&
			clickedOnceAt >= getNow() - doubleClickMaximumIntervalMilliseconds
		) {
			setProgress(1)
			handleBeforeAction('double-click')
		} else {
			clickedOnceAt = getNow()
			console.log({ isClickedOnceAt: clickedOnceAt })
		}
		startLoopIfIdle()
	}
	const handlePointerDown = () => {
		pressStart = {
			time: getNow(),
			progress,
		}
		console.log('handlePointerDown')
		startLoopIfIdle()
	}
	const handlePointerUp = () => {
		if (pressStart === null) {
			return
		}
		pressStart = null
		console.log('handlePointerUp')
		if (progress === 1) {
			handleBeforeAction('long-press')
		}
		startLoopIfIdle()
	}
	const handlePointerLeave = () => {
		if (pressStart === null) {
			return
		}
		pressStart = null
		console.log('handlePointerLeave')
		startLoopIfIdle()
	}

	element.addEventListener('click', handleClick)
	element.addEventListener('pointerdown', handlePointerDown)
	element.addEventListener('pointerup', handlePointerUp)
	element.addEventListener('pointerleave', handlePointerLeave)

	const destroy = () => {
		element.removeEventListener('click', handleClick)
		element.removeEventListener('pointerdown', handlePointerDown)
		element.removeEventListener('pointerup', handlePointerUp)
		element.removeEventListener('pointerleave', handlePointerLeave)
		stopLoop()
	}

	return { destroy, isPressed: () => pressStart, progress: () => progress }
}
