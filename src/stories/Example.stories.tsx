import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { Example } from './Example'
import './global.css'

export default {
	title: 'Example',
	component: Example,
	argTypes: {
		firstSingleClickProgress: {
			defaultValue: 0.3,
		},
		minimumHoldDuration: {
			defaultValue: 300,
		},
		holdDurationToAction: {
			defaultValue: 800,
		},
		decayDuration: {
			defaultValue: 1000,
		},
		decayAfterActionDuration: {
			defaultValue: 200,
		},
		doubleClickMaximumInterval: {
			defaultValue: 500,
		},
	},
} as ComponentMeta<typeof Example>

const Template: ComponentStory<typeof Example> = (args) => <Example {...args} />

export const Demo = Template.bind({})
