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
	let pressStartAt: number | null = null
	let clickedOnceAt: number | null = null
	let loopId: ReturnType<typeof requestAnimationFrame> | null = null

	const loop = () => {
		console.log('loop')
		if (progress === 0 && pressStartAt === null) {
			stopLoop()
			return
		}
		if (pressStartAt === null) {
			setProgress(progress - 0.01) // @TODO
		} else {
			setProgress(progress + 0.01) // @TODO
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
		if (progress < firstSingleClickProgress / 4) {
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
		pressStartAt = getNow()
		console.log('handlePointerDown')
		startLoopIfIdle()
	}
	const handlePointerUp = () => {
		if (pressStartAt === null) {
			return
		}
		pressStartAt = null
		console.log('handlePointerUp')
		if (progress === 1) {
			handleBeforeAction('long-press')
		}
		startLoopIfIdle()
	}
	const handlePointerLeave = () => {
		if (pressStartAt === null) {
			return
		}
		pressStartAt = null
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

	return { destroy, isPressed: () => pressStartAt, progress: () => progress }
}
