import { Lynguist, transChoice } from '@/index'
import { beforeEach } from 'vitest'

beforeEach(() => {
    Lynguist({
        locale: 'en',
        translations: {
            usersCount: 'A single user|:count users in total',
            multiPlaceholder: ':count file of :name|:count files of :name',
            capitalizedUser: 'One :Name|:count :Name',
            uppercaseType: 'Single :TYPE|:count :TYPE',
            doubleCount: ':count item (:count total)|:count items (:count total)',
            empty: '',
        },
    })
})

it('returns the correct string based on the count', () => {
    expect(transChoice('usersCount', 0)).toBe('0 users in total')
    expect(transChoice('usersCount', 1)).toBe('A single user')
    expect(transChoice('usersCount', 2)).toBe('2 users in total')
})

it('returns the key if no translations was found', () => {
    expect(transChoice('inexistent', 0)).toBe('inexistent')
    expect(transChoice('empty', 0)).toBe('empty')
})

it('returns translation with multiple placeholders including count', () => {
    expect(transChoice('multiPlaceholder', 1, { name: 'John' })).toBe('1 file of John')
    expect(transChoice('multiPlaceholder', 3, { name: 'Jane' })).toBe('3 files of Jane')
})

it('returns empty string when key is empty string', () => {
    expect(transChoice('', 0)).toBe('')
})

it('handles locale-specific pluralization with Russian locale', () => {
    Lynguist({
        locale: 'ru',
        translations: {
            russianApples: ':count яблоко|:count яблока|:count яблок',
        },
    })

    expect(transChoice('russianApples', 1)).toBe('1 яблоко')
    expect(transChoice('russianApples', 2)).toBe('2 яблока')
    expect(transChoice('russianApples', 5)).toBe('5 яблок')
    expect(transChoice('russianApples', 21)).toBe('21 яблоко')
})

it('capitalizes the first letter based on placeholder name', () => {
    expect(transChoice('capitalizedUser', 1, { Name: 'alex' })).toBe('One Alex')
    expect(transChoice('capitalizedUser', 5, { Name: 'john' })).toBe('5 John')
})

it('capitalizes all letters according to the placeholder name', () => {
    expect(transChoice('uppercaseType', 1, { TYPE: 'file' })).toBe('Single FILE')
    expect(transChoice('uppercaseType', 3, { TYPE: 'document' })).toBe('3 DOCUMENT')
})

it('handles null or undefined placeholders gracefully', () => {
    expect(transChoice('multiPlaceholder', 1, { item: null })).toBe('1 file of :name')
    expect(transChoice('multiPlaceholder', 5, { item: undefined })).toBe('5 files of :name')
})

it('replaces multiple occurrences of :count in translation', () => {
    expect(transChoice('doubleCount', 1)).toBe('1 item (1 total)')
    expect(transChoice('doubleCount', 7)).toBe('7 items (7 total)')
})

describe('Interval Notation', () => {
    beforeEach(() => {
        Lynguist({
            locale: 'en',
            translations: {
                exactZero: '{0} No items',
                exactOne: '{1} One item',
                range: '[1,10] Some items|[11,*] Many items',
                mixed: '{0} None|{1} One|[2,4] A few|[5,*] Many',
                withCount: '{0} No apples|{1} :count apple|[2,*] :count apples',
                withPlaceholder: '{0} :Name has none|{1} :Name has one|[2,*] :Name has :count',
            },
        })
    })

    it('matches exact value with {n} notation', () => {
        expect(transChoice('exactZero', 0)).toBe('No items')
        expect(transChoice('exactOne', 1)).toBe('One item')
    })

    it('matches range with [n,m] notation', () => {
        expect(transChoice('range', 1)).toBe('Some items')
        expect(transChoice('range', 5)).toBe('Some items')
        expect(transChoice('range', 10)).toBe('Some items')
        expect(transChoice('range', 11)).toBe('Many items')
        expect(transChoice('range', 100)).toBe('Many items')
    })

    it('matches mixed interval notation', () => {
        expect(transChoice('mixed', 0)).toBe('None')
        expect(transChoice('mixed', 1)).toBe('One')
        expect(transChoice('mixed', 2)).toBe('A few')
        expect(transChoice('mixed', 4)).toBe('A few')
        expect(transChoice('mixed', 5)).toBe('Many')
        expect(transChoice('mixed', 100)).toBe('Many')
    })

    it('replaces :count in interval notation', () => {
        expect(transChoice('withCount', 0)).toBe('No apples')
        expect(transChoice('withCount', 1)).toBe('1 apple')
        expect(transChoice('withCount', 5)).toBe('5 apples')
    })

    it('replaces placeholders in interval notation', () => {
        expect(transChoice('withPlaceholder', 0, { Name: 'john' })).toBe('John has none')
        expect(transChoice('withPlaceholder', 1, { Name: 'jane' })).toBe('Jane has one')
        expect(transChoice('withPlaceholder', 5, { Name: 'alex' })).toBe('Alex has 5')
    })
})
