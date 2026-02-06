import { LynguistLocale, LynguistOptions, LynguistTerm, ReplacePlaceholders } from '@/types'
import { hasIntervalNotation, parseIntervalNotation, pluralIndex, replacePlaceholders } from '@/utils'
// @ts-ignore - Virtual module provided by Vite plugin
import translations from 'virtual:lynguist-translations'

export type { LynguistTranslations, LynguistTerm, LynguistLocale, ReplacePlaceholders } from '@/types'

type LocaleChangeCallback = (locale: string, previousLocale: string) => void

const isServer = typeof window === 'undefined'
const listeners = new Set<LocaleChangeCallback>()

function detectLocale(): string {
    return !isServer ? document.documentElement.lang?.replace('-', '_') || 'en' : 'en'
}

interface Config {
    locale: string
    translations: Record<string, string>
    allTranslations: Record<string, Record<string, string>>
}

let config: Config = {
    locale: detectLocale(),
    translations: translations[detectLocale()] ?? {},
    allTranslations: translations,
}

/**
 * Initialize Lynguist with custom options.
 * When using the Vite plugin, this is called automatically.
 */
export function Lynguist(options: LynguistOptions): void {
    config.locale = options.locale as string
    config.translations = options.translations as Record<string, string>
}

/**
 * Subscribe to locale changes.
 * @returns Unsubscribe function
 */
export function onLocaleChange(callback: LocaleChangeCallback): () => void {
    listeners.add(callback)

    return () => listeners.delete(callback)
}

/**
 * Set the current locale.
 */
export function setLocale(locale: string): void {
    if (!config.allTranslations[locale]) {
        console.warn(
            `[lynguist] Locale "${locale}" not found. Available: ${Object.keys(config.allTranslations).join(', ')}`,
        )
        return
    }

    const previousLocale = config.locale
    config.locale = locale
    config.translations = config.allTranslations[locale]

    listeners.forEach(callback => callback(locale, previousLocale))
}

/**
 * Get the current locale.
 */
export function getLocale(): string {
    return config.locale
}

/**
 * Get all available locales.
 */
export function getAvailableLocales(): string[] {
    return Object.keys(config.allTranslations)
}

/**
 * Get translations for a specific locale (or current locale if not specified).
 */
export function getTranslations(locale?: string): Record<string, string> {
    return config.allTranslations[locale ?? config.locale] ?? {}
}

export function __(key: LynguistTerm, replace?: ReplacePlaceholders): string
export function __(key: LynguistTerm, count: number, replace?: ReplacePlaceholders): string
export function __(
    key: LynguistTerm,
    countOrReplace?: number | ReplacePlaceholders,
    replace?: ReplacePlaceholders,
): string {
    if (typeof countOrReplace === 'number') {
        return transChoice(key, countOrReplace, replace)
    }

    return trans(key, countOrReplace)
}

export function trans(key: LynguistTerm, replace?: ReplacePlaceholders): string {
    let translation = config.translations[key]

    if (!(key in config.translations) || !translation) return key as string

    if (replace) {
        translation = replacePlaceholders(translation, replace)
    }

    return translation
}

export function transChoice(key: LynguistTerm, count: number, replace?: ReplacePlaceholders): string {
    if (!(key in config.translations) || !config.translations[key]) return key as string

    const translationString = config.translations[key]
    let translation: string

    // Check for interval notation first ({0}, {1}, [1,19], [20,*])
    if (hasIntervalNotation(translationString)) {
        const intervalResult = parseIntervalNotation(translationString, count)

        if (intervalResult !== null) {
            translation = intervalResult
        } else {
            translation = translationString.split('|')[0].replace(/^[{[].*?[}\]]\s*/, '')
        }
    } else {
        const parts = translationString.split('|')
        const index = pluralIndex(count, config.locale as LynguistLocale)

        translation = parts[index] ?? parts[parts.length - 1]
    }

    translation = translation.replace(/:count/gi, count.toString())

    if (replace) {
        translation = replacePlaceholders(translation, replace)
    }

    return translation
}

/**
 * Parse link placeholders in a string and replace with HTML anchor tags.
 * Use [text] to mark link text, and escape with \\[ for literal brackets.
 *
 * @example
 * linkify('Click [here] to continue', 'https://example.com')
 * // Returns: 'Click <a href="https://example.com">here</a> to continue'
 *
 * @example
 * linkify('[First] and [second] links', ['https://a.com', 'https://b.com'])
 * // Returns: '<a href="https://a.com">First</a> and <a href="https://b.com">second</a> links'
 *
 * @example
 * linkify('Use \\[brackets\\] literally', 'https://example.com')
 * // Returns: 'Use [brackets] literally'
 */
export function linkify(text: string, urls: string | string[]): string {
    const urlArray = Array.isArray(urls) ? urls : [urls]
    let urlIndex = 0

    // First, replace escaped brackets with temporary placeholders
    const escapedOpen = '\x00ESCAPED_OPEN\x00'
    const escapedClose = '\x00ESCAPED_CLOSE\x00'

    let result = text.replace(/\\\[/g, escapedOpen).replace(/\\]/g, escapedClose)

    // Replace [text] patterns with anchor tags
    result = result.replace(/\[([^\]]+)]/g, (match, linkText) => {
        if (urlIndex < urlArray.length) {
            const url = urlArray[urlIndex++]
            return `<a href="${url}">${linkText}</a>`
        }

        // No corresponding URL, leave as-is
        return match
    })

    // Restore escaped brackets as literal brackets
    result = result.replace(new RegExp(escapedOpen, 'g'), '[').replace(new RegExp(escapedClose, 'g'), ']')

    return result
}
