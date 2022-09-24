import {
	RefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'

const firstSingleClickProgress = 0.3
const minimumHoldDurationMilliseconds = 300
const holdDurationToActionMilliseconds = 800

const getNow = () => Date.now()

export type MoreThanClickType = 'double-click' | 'long-press'

export type MoreThanClickCallback = (type: MoreThanClickType) => void

export const useMoreThanClick = (
	ref: RefObject<HTMLElement>,
	actionHandler: MoreThanClickCallback,
) => {
	const [progress, setProgress] = useState(0)
	const actionTypeRef = useRef<MoreThanClickType>(
		'double-click' /* random placeholder value */,
	)
	const [holdStart, setHoldStart] = useState({
		progress: 0,
		time: 0,
	})
	const [holdEnd, setHoldEnd] = useState(0)
	const [isHolding, setIsHolding] = useState(false)

	const triggerActionHandler = useCallback(
		(type: MoreThanClickType) => {
			setProgress(0) // @TODO: delay/decay maybe
			actionHandler(type)
		},
		[actionHandler],
	)

	const handleClick = useCallback(() => {
		console.log('click')
		if (holdEnd - holdStart.time >= minimumHoldDurationMilliseconds) {
			if (progress === 1) {
				triggerActionHandler('long-press')
			}
			return
		}
		if (progress < firstSingleClickProgress / 2) {
			setProgress(firstSingleClickProgress)
			return
		}
		setProgress(1)
		triggerActionHandler('double-click')
	}, [
		actionTypeRef,
		actionHandler,
		holdEnd,
		holdStart,
		triggerActionHandler,
		progress,
	])

	const handlePointerDown = useCallback(() => {
		console.log('down')
		setHoldStart({ progress, time: getNow() })
		setIsHolding(true)
	}, [progress])

	const handlePointerUp = useCallback(() => {
		console.log('up')
		if (!isHolding) {
			return
		}
		setHoldEnd(getNow())
		setIsHolding(false)
	}, [isHolding])

	useEffect(() => {
		const element = ref.current
		if (element === null) {
			return
		}

		element.addEventListener('click', handleClick)
		element.addEventListener('pointerdown', handlePointerDown)
		element.addEventListener('pointerup', handlePointerUp) // @TODO: handle pointer leave/cancel

		return () => {
			element.removeEventListener('click', handleClick)
			element.removeEventListener('pointerdown', handlePointerDown)
			element.removeEventListener('pointerup', handlePointerUp)
		}
	}, [ref, handleClick, handlePointerDown, handlePointerUp])

	// @TODO: add decay

	useEffect(() => {
		if (!isHolding) {
			return
		}

		let callback: ReturnType<typeof requestAnimationFrame>
		const loop = () => {
			console.log('loop')
			setProgress((progress) => {
				const now = getNow()
				console.log({ progress, start: holdStart.time, now })
				return Math.min(
					1,
					holdStart.progress +
						(now - holdStart.time) / holdDurationToActionMilliseconds,
				)
			})
			callback = requestAnimationFrame(loop)
		}
		loop()

		return () => {
			cancelAnimationFrame(callback)
		}
	}, [isHolding, holdStart])

	return useMemo(() => ({ progress }), [progress])
}
