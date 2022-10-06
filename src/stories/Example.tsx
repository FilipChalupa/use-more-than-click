import React, {
	CSSProperties,
	FunctionComponent,
	useCallback,
	useMemo,
	useRef,
	useState,
} from 'react'
import { useReward } from 'react-rewards'
import { MoreThanClickCallback, useMoreThanClick } from '../useMoreThanClick'

type Props = Parameters<typeof useMoreThanClick>['2'] & {
	disabled?: boolean
}

export const Example: FunctionComponent<Props> = ({
	firstSingleClickProgress,
	minimumHoldDuration,
	holdDurationToAction,
	decayDuration,
	decayAfterActionDuration,
	doubleClickMaximumInterval,
	disabled,
}) => {
	const ref = useRef<HTMLButtonElement>(null)
	const { reward } = useReward('confettiReward', 'confetti')
	const [actionInfo, setActionInfo] = useState({
		text: '',
		key: 0,
	})
	const handleDoubleClickOrLongPress = useCallback<MoreThanClickCallback>(
		(type) => {
			reward()
			setActionInfo({ text: `User performed ${type}.`, key: Math.random() })
		},
		[reward],
	)

	const options = useMemo(
		() => ({
			firstSingleClickProgress,
			minimumHoldDuration,
			holdDurationToAction,
			decayDuration,
			decayAfterActionDuration,
			doubleClickMaximumInterval,
		}),
		[
			firstSingleClickProgress,
			minimumHoldDuration,
			holdDurationToAction,
			decayDuration,
			decayAfterActionDuration,
			doubleClickMaximumInterval,
		],
	)

	const { progress } = useMoreThanClick(
		ref,
		handleDoubleClickOrLongPress,
		options,
	)

	return (
		<>
			<h2>Example button</h2>
			<p>Click twice or give it one long press.</p>
			<div className="example-button-wrapper">
				<div className="example-button-confetti" id="confettiReward" />
				<button
					className="example-button"
					style={
						{
							'--progress': progress,
						} as CSSProperties
					}
					ref={ref}
					disabled={disabled}
				>
					Click me
				</button>
			</div>
			<div className="example-button-action-wrapper">
				<p key={actionInfo.key} className="example-button-action">
					{actionInfo.text}
				</p>
			</div>
		</>
	)
}
