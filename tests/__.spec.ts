import { __, Lynguist } from '@/index'
import { beforeEach } from 'vitest'

beforeEach(() => {
    Lynguist({
        locale: 'en',
        translations: {
            welcome: 'Hello World',
            greeting: 'Hello :name',
            usersCount: 'A single user|:count users in total',
            multiPlaceholder: ':count file of :name|:count files of :name',
        },
    })
})

it('returns the translated string', () => {
    expect(__('welcome')).toBe('Hello World')
})

it('returns translation with single placeholder substitution', () => {
    expect(__('greeting', { name: 'John' })).toBe('Hello John')
})

it('returns the correct string based on the count', () => {
    expect(__('usersCount', 0)).toBe('0 users in total')
    expect(__('usersCount', 1)).toBe('A single user')
    expect(__('usersCount', 2)).toBe('2 users in total')
})

it('returns translation with multiple placeholders including count', () => {
    expect(__('multiPlaceholder', 1, { name: 'John' })).toBe('1 file of John')
    expect(__('multiPlaceholder', 3, { name: 'Jane' })).toBe('3 files of Jane')
})
