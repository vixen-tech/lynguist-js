import type { Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

export interface LynguistPluginOptions {
    /**
     * Path to the Laravel lang directory containing translation files.
     * @default 'lang'
     */
    langPath?: string

    /**
     * Additional paths to scan for translation files.
     */
    additionalLangPaths?: string[]
}

interface TranslationFiles {
    [locale: string]: Record<string, string>
}

/**
 * Vite plugin that loads Laravel translation files and provides them
 * via a virtual module for use with Lynguist.
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { lynguist } from '@vixen-tech/lynguist/vite'
 *
 * export default defineConfig({
 *     plugins: [
 *         lynguist({
 *             langPath: 'lang',
 *             additionalLangPaths: ['vendor/package/lang']
 *         })
 *     ]
 * })
 * ```
 *
 * @example
 * ```ts
 * // In your app
 * import { __, setLocale, getLocale, onLocaleChange } from '@vixen-tech/lynguist'
 *
 * // Use translations
 * __('welcome')
 * __('greeting', { name: 'John' })
 * __('items', 5)
 *
 * // Switch locale at runtime
 * setLocale('de')
 * ```
 */
export function lynguist(options: LynguistPluginOptions = {}): Plugin {
    const virtualModuleId = 'virtual:lynguist-translations'
    const resolvedVirtualModuleId = '\0' + virtualModuleId

    const langPath = (options.langPath ?? 'lang').replace(/[\\/]$/, '') + path.sep
    const additionalLangPaths = options.additionalLangPaths ?? []
    const paths = [langPath, ...additionalLangPaths]

    function loadTranslations(...langPaths: string[]): TranslationFiles {
        const translations: TranslationFiles = {}

        for (const lp of langPaths) {
            if (!fs.existsSync(lp)) {
                continue
            }

            const files = fs.readdirSync(lp)

            for (const file of files) {
                if (!file.endsWith('.json')) continue

                const locale = path.basename(file, '.json')
                const filePath = path.join(lp, file)

                try {
                    const content = fs.readFileSync(filePath, 'utf-8')
                    const parsed = JSON.parse(content)

                    // Merge with existing translations for this locale
                    translations[locale] = {
                        ...translations[locale],
                        ...parsed,
                    }
                } catch (error) {
                    console.error(`[lynguist] Failed to load translation file: ${filePath}`, error)
                }
            }
        }

        return translations
    }

    return {
        name: 'vite-plugin-lynguist',
        enforce: 'pre',

        config() {
            return {
                optimizeDeps: {
                    exclude: [virtualModuleId],
                },
                ssr: {
                    noExternal: ['@vixen-tech/lynguist'],
                },
            }
        },

        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId
            }
        },

        load(id) {
            if (id === resolvedVirtualModuleId) {
                const translations = loadTranslations(...paths)
                return `export default ${JSON.stringify(translations)}`
            }
        },

        handleHotUpdate(ctx) {
            for (const lp of paths) {
                const relative = path.relative(lp, ctx.file)
                const isSubpath = relative && !relative.startsWith('..') && !path.isAbsolute(relative)

                if (isSubpath && ctx.file.endsWith('.json')) {
                    const virtualModule = ctx.server.moduleGraph.getModuleById(resolvedVirtualModuleId)

                    if (virtualModule) {
                        ctx.server.moduleGraph.invalidateModule(virtualModule)
                        ctx.server.ws.send({
                            type: 'full-reload',
                            path: '*',
                        })
                    }

                    return
                }
            }
        },
    }
}

export default lynguist
