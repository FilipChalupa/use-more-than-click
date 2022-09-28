import React, {
	CSSProperties,
	FunctionComponent,
	useCallback,
	useRef,
	useState,
} from 'react'
import { useReward } from 'react-rewards'
import { MoreThanClickCallback, useMoreThanClick } from '../useMoreThanClick'

export const Example: FunctionComponent = () => {
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
	const { progress } = useMoreThanClick(ref, handleDoubleClickOrLongPress)

	return (
		<>
			<h2>Example button</h2>
			<p>Press twice or give it one long press.</p>
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
				>
					Click me
				</button>
			</div>
			<div className="example-button-action-wrapper">
				{actionInfo && (
					<p key={actionInfo.key} className="example-button-action">
						{actionInfo.text}
					</p>
				)}
			</div>
		</>
	)
}
