import { LynguistLocale, ReplacePlaceholders } from '@/types'

export function replacePlaceholders(text: string, replace: ReplacePlaceholders): string {
    let translation = text

    for (const [placeholder, value] of Object.entries(replace)) {
        if (value !== null && value !== undefined) {
            let parameterValue = String(value)

            if (placeholder === placeholder.toUpperCase()) {
                parameterValue = parameterValue.toUpperCase()
            } else if (placeholder[0] === placeholder[0].toUpperCase()) {
                parameterValue = parameterValue.charAt(0).toUpperCase() + parameterValue.slice(1)
            }

            translation = translation.replace(`:${placeholder}`, parameterValue)
        }
    }

    return translation
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
