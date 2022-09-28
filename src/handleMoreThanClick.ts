export type MoreThanClickType = 'double-click' | 'long-press'

// @TODO: make configurable
const firstSingleClickProgress = 0.3
const minimumHoldDurationMilliseconds = 300
const holdDurationToActionMilliseconds = 800
const decayDurationMilliseconds = 1000
const decayAfterActionDurationMilliseconds = 200
const doubleClickMaximumIntervalMilliseconds = 500

const getNow = () => Date.now()

export const handleMoreThanClick = (
	element: HTMLElement,
	handleAction: (type: MoreThanClickType) => void = () => {},
	handleProgressChange: (progress: number) => void = () => {},
) => {
	let progress = 0
	let lastPressAction: {
		type: 'down' | 'up' | 'leave' | 'click'
		time: number
		progress: number
	} | null = null
	let clickedOnceAt: number | null = null
	let loopId: ReturnType<typeof requestAnimationFrame> | null = null
	let isActionPerformed = false

	const loop = () => {
		const now = getNow()
		if (progress === 0 && lastPressAction?.type !== 'down') {
			stopLoop()
			return
		}
		if (lastPressAction?.type === 'down') {
			setProgress(
				lastPressAction.progress +
					(now - lastPressAction.time) / holdDurationToActionMilliseconds,
			)
		} else if (lastPressAction !== null) {
			setProgress(
				lastPressAction.progress -
					(now - lastPressAction.time) /
						(isActionPerformed
							? decayAfterActionDurationMilliseconds
							: decayDurationMilliseconds),
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
				isActionPerformed = false
			}
			handleProgressChange(progress)
		}
	}

	const handleBeforeAction = (type: MoreThanClickType) => {
		isActionPerformed = true
		handleAction(type)
	}

	const handleClick = () => {
		if (
			progress * holdDurationToActionMilliseconds <
			minimumHoldDurationMilliseconds
		) {
			setProgress(firstSingleClickProgress)
		}
		if (
			clickedOnceAt !== null &&
			clickedOnceAt >= getNow() - doubleClickMaximumIntervalMilliseconds
		) {
			handleBeforeAction('double-click')
		} else {
			clickedOnceAt = getNow()
		}
		lastPressAction = {
			type: 'click',
			time: getNow(),
			progress,
		}
		startLoopIfIdle()
	}
	const handlePointerDown = (event: PointerEvent) => {
		if (event.button !== 0) {
			return
		}
		lastPressAction = {
			type: 'down',
			time: getNow(),
			progress,
		}
		startLoopIfIdle()
	}
	const handlePointerUp = (event: PointerEvent) => {
		if (lastPressAction?.type !== 'down' || event.button !== 0) {
			return
		}
		lastPressAction = {
			type: 'up',
			time: getNow(),
			progress,
		}
		if (progress === 1) {
			handleBeforeAction('long-press')
		}
		startLoopIfIdle()
	}
	const handlePointerLeave = () => {
		if (lastPressAction?.type !== 'down') {
			return
		}
		lastPressAction = {
			type: 'leave',
			time: getNow(),
			progress,
		}
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

	return {
		destroy,
		isPressed: () => lastPressAction?.type === 'down',
		progress: () => progress,
	}
}
