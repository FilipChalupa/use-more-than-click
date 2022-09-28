export type MoreThanClickType = 'double-click' | 'long-press'

const firstSingleClickProgress = 0.3
const minimumHoldDurationMilliseconds = 300
const holdDurationToActionMilliseconds = 800
const decayDurationMilliseconds = 1000
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

	const loop = () => {
		console.log('loop')
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
					(now - lastPressAction.time) / decayDurationMilliseconds,
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
		console.log({ newProgress })
		const newProgressClamped = Math.min(1, Math.max(0, newProgress))
		if (newProgressClamped !== progress) {
			progress = newProgressClamped
			if (progress === 0) {
				clickedOnceAt = null
				console.log({ clickedOnceAt })
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
			console.log('JUMPPP')
			setProgress(firstSingleClickProgress)
			lastPressAction = {
				type: 'click',
				time: getNow(),
				progress,
			}
			console.log('JUMPPP after')
		}
		if (
			clickedOnceAt !== null &&
			clickedOnceAt >= getNow() - doubleClickMaximumIntervalMilliseconds
		) {
			setProgress(1)
			handleBeforeAction('double-click')
		} else {
			clickedOnceAt = getNow()
			console.log({ clickedOnceAt })
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
		console.log('handlePointerDown')
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
		console.log('handlePointerUp')
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

	return {
		destroy,
		isPressed: () => lastPressAction?.type === 'down',
		progress: () => progress,
	}
}
