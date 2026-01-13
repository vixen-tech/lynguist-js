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
