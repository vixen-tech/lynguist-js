import { LynguistLocale, ReplacePlaceholders } from '@/types'

/**
 * Replace placeholders in translation string with values.
 * Supports Laravel-style case transformation:
 * - :name → lowercase value
 * - :Name → capitalized value
 * - :NAME → uppercase value
 */
export function replacePlaceholders(text: string, replace: ReplacePlaceholders): string {
    let translation = text

    for (const [key, value] of Object.entries(replace)) {
        if (value === null || value === undefined) continue

        const stringValue = String(value)
        const lowerKey = key.toLowerCase()

        const regex = new RegExp(`:${lowerKey}(?![a-zA-Z0-9_])`, 'gi')

        translation = translation.replace(regex, match => {
            const placeholder = match.slice(1) // Remove the ':'

            if (placeholder === placeholder.toUpperCase()) {
                return stringValue.toUpperCase()
            } else if (placeholder[0] === placeholder[0].toUpperCase()) {
                return stringValue.charAt(0).toUpperCase() + stringValue.slice(1).toLowerCase()
            } else {
                return stringValue
            }
        })
    }

    return translation
}

/**
 * Parse interval notation and return the matching translation part.
 * Supports: {0}, {1}, [1,19], [20,*]
 */
export function parseIntervalNotation(translation: string, count: number): string | null {
    const parts = translation.split('|')

    for (const part of parts) {
        const trimmed = part.trim()

        // Match {n} - exact value
        const exactMatch = trimmed.match(/^\{(\d+)\}\s*(.*)$/)

        if (exactMatch) {
            const exactValue = parseInt(exactMatch[1], 10)

            if (count === exactValue) {
                return exactMatch[2]
            }

            continue
        }

        // Match [n,m] or [n,*] - range
        const rangeMatch = trimmed.match(/^\[(\d+),(\d+|\*)\]\s*(.*)$/)

        if (rangeMatch) {
            const min = parseInt(rangeMatch[1], 10)
            const max = rangeMatch[2] === '*' ? Infinity : parseInt(rangeMatch[2], 10)

            if (count >= min && count <= max) {
                return rangeMatch[3]
            }

            continue
        }
    }

    return null
}

/**
 * Check if a translation string uses interval notation.
 */
export function hasIntervalNotation(translation: string): boolean {
    return /(\{[\d]+\}|\[[\d]+,[\d*]+\])/.test(translation)
}

export function pluralIndex(count: number, locale: LynguistLocale): number {
    switch (locale) {
        case 'af':
        case 'bn':
        case 'bg':
        case 'ca':
        case 'da':
        case 'de':
        case 'el':
        case 'en':
        case 'eo':
        case 'es':
        case 'et':
        case 'eu':
        case 'fa':
        case 'fi':
        case 'fo':
        case 'fur':
        case 'fy':
        case 'gl':
        case 'gu':
        case 'ha':
        case 'he':
        case 'hu':
        case 'is':
        case 'it':
        case 'ku':
        case 'lb':
        case 'ml':
        case 'mn':
        case 'mr':
        case 'nah':
        case 'nb':
        case 'ne':
        case 'nl':
        case 'nn':
        case 'no':
        case 'om':
        case 'or':
        case 'pa':
        case 'pap':
        case 'ps':
        case 'pt':
        case 'so':
        case 'sq':
        case 'sv':
        case 'sw':
        case 'ta':
        case 'te':
        case 'tk':
        case 'ur':
        case 'zu':
            return count === 1 ? 0 : 1

        case 'am':
        case 'bh':
        case 'fil':
        case 'fr':
        case 'gun':
        case 'hi':
        case 'hy':
        case 'ln':
        case 'mg':
        case 'nso':
        case 'ti':
        case 'wa':
        case 'xbr':
            return count === 0 || count === 1 ? 0 : 1

        case 'be':
        case 'bs':
        case 'hr':
        case 'ru':
        case 'sr':
        case 'uk':
            return count % 10 === 1 && count % 100 !== 11 ? 0 : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20) ? 1 : 2

        case 'cs':
        case 'sk':
            return count === 1 ? 0 : count >= 2 && count <= 4 ? 1 : 2

        case 'ga':
            return count === 1 ? 0 : count === 2 ? 1 : 2

        case 'lt':
            return count % 10 === 1 && count % 100 != 11 ? 0 : count % 10 >= 2 && (count % 100 < 10 || count % 100 >= 20) ? 1 : 2

        case 'sl':
            return count % 100 === 1 ? 0 : count % 100 === 2 ? 1 : count % 100 === 3 || count % 100 === 4 ? 2 : 3

        case 'mk':
            return count % 10 === 1 ? 0 : 1

        case 'mt':
            return count === 1 ? 0 : count === 0 || (count % 100 > 1 && count % 100 < 11) ? 1 : count % 100 > 10 && count % 100 < 20 ? 2 : 3

        case 'lv':
            return count === 0 ? 0 : count % 10 === 1 && count % 100 != 11 ? 1 : 2

        case 'pl':
            return count === 1 ? 0 : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 1 : 2

        case 'cy':
            return count === 1 ? 0 : count === 2 ? 1 : count === 8 || count === 11 ? 2 : 3

        case 'ro':
            return count === 1 ? 0 : count === 0 || (count % 100 > 0 && count % 100 < 20) ? 1 : 2

        case 'ar':
            return count === 0
                ? 0
                : count === 1
                  ? 1
                  : count === 2
                    ? 2
                    : count % 100 >= 3 && count % 100 <= 10
                      ? 3
                      : count % 100 >= 11 && count % 100 <= 99
                        ? 4
                        : 5

        default:
            return 0
    }
}
