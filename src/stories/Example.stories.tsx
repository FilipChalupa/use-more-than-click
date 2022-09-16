import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { Example } from './Example'
import './global.css'

export default {
	title: 'Example',
	component: Example,
} as ComponentMeta<typeof Example>

const Template: ComponentStory<typeof Example> = (args) => <Example {...args} />

export const Demo = Template.bind({})
