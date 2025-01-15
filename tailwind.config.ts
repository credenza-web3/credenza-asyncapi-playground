import type { Config } from 'tailwindcss';
import DaisyUI from 'daisyui'
import DaisyUIThemes from 'daisyui/src/theming/themes'

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [DaisyUI],
	daisyui: {
    base: true,
    themes: [
      {
        business: {
          ...DaisyUIThemes.business,
        },
      },
    ]
  },
} satisfies Config;
