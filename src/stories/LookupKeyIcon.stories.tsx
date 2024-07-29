import type { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'
import LookupKeyIcon from '../Components/LookupKeyIcon'
import {LOOKUP_KEYS} from "../constants";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'LookupKeyIcon',
    component: LookupKeyIcon,
    decorators: [withRouter,],
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        lookupKey: {options: Object.values(LOOKUP_KEYS),},
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    args: {lookupKey: LOOKUP_KEYS.CELL, tooltip: false},
} satisfies Meta<typeof LookupKeyIcon>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Cell: Story = {
    args: {},
}

export const WithTooltip: Story = {
    args: {tooltip: true},
}

export const WithPluralTooltip: Story = {
    args: {tooltip: true, plural: true},
}
