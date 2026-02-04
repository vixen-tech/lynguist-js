import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
    test: {
        globals: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            'virtual:lynguist-translations': path.resolve(__dirname, './tests/__mocks__/virtual-translations.ts'),
        },
    },
})
