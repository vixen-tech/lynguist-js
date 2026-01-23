import { LynguistOptions, LynguistTerm, ReplacePlaceholders } from '@/types'
import { pluralIndex, replacePlaceholders } from '@/utils'

export type { LynguistTranslations, LynguistTerm } from '@/types'

let lynguist: LynguistOptions = {
    locale: 'en',
    translations: {},
}

export function Lynguist(options: LynguistOptions): void {
    lynguist.locale = options.locale
    lynguist.translations = options.translations
}

export function __(key: LynguistTerm, replace?: ReplacePlaceholders): string
export function __(key: LynguistTerm, count: number, replace?: ReplacePlaceholders): string
export function __(key: LynguistTerm, countOrReplace?: number | ReplacePlaceholders, replace?: ReplacePlaceholders): string {
    if (typeof countOrReplace === 'number') {
        return transChoice(key, countOrReplace, replace)
    }

    return trans(key, countOrReplace)
}

export function trans(key: LynguistTerm, replace?: ReplacePlaceholders): string {
    let translation = lynguist.translations[key]

    if (!(key in lynguist.translations) || !translation) return key as string

    if (replace) {
        translation = replacePlaceholders(translation, replace)
    }

    return translation
}

export function transChoice(key: LynguistTerm, count: number, replace?: ReplacePlaceholders): string {
    if (!(key in lynguist.translations) || !lynguist.translations[key]) return key as string

    const parts = lynguist.translations[key].split('|')
    let index = pluralIndex(count, lynguist.locale)

    let translation = parts[index]
    translation = translation.replaceAll(/:count/g, count.toString())

    if (replace) {
        translation = replacePlaceholders(translation, replace)
    }

    return translation
}
