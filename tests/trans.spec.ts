import { __, Lynguist, trans } from '@/index'
import { beforeEach } from 'vitest'

beforeEach(() => {
    Lynguist({
        locale: 'en',
        translations: {
            welcome: 'Hello World',
            greeting: 'Hello :name',
            'greeting.multiple': 'Hello :first and :second',
            'user.count': 'You have :count users',
            'special-chars': 'Value with special chars!@#',
            'nested.key.value': 'Nested translation',
            CaseSensitive: 'Case sensitive text',
            ucfirst: 'Hi :Name',
            uppercase: 'My :NAME!',
        },
    })
})

it('returns the translated string', () => {
    expect(trans('welcome')).toBe('Hello World')
})

it('returns the key itself if translation was not found', () => {
    expect(trans('incorrect-key')).toBe('incorrect-key')
})

it('returns translation with single placeholder substitution', () => {
    expect(trans('greeting', { name: 'John' })).toBe('Hello John')
})

it('returns translation with multiple placeholder substitutions', () => {
    expect(trans('greeting.multiple', { first: 'John', second: 'Jane' })).toBe('Hello John and Jane')
})

it('returns translation with numeric placeholder', () => {
    expect(trans('user.count', { count: 5 })).toBe('You have 5 users')
})

it('returns empty string when key is empty string', () => {
    expect(trans('')).toBe('')
})

it('handles null or undefined placeholders gracefully', () => {
    expect(trans('greeting', { name: null })).toBe('Hello :name')
})

it('returns translation with special characters in key', () => {
    expect(trans('special-chars')).toBe('Value with special chars!@#')
})

it('returns translation with nested key structure', () => {
    expect(trans('nested.key.value')).toBe('Nested translation')
})

it('handles case sensitive keys correctly', () => {
    expect(trans('CaseSensitive')).toBe('Case sensitive text')
    expect(trans('casesensitive')).toBe('casesensitive')
})

it('capitalizes the first letter based on placeholder name', () => {
    expect(__('ucfirst', { Name: 'alex' })).toBe('Hi Alex')
})

it('capitalizes all letter according to the placeholder name', () => {
    expect(__('uppercase', { NAME: 'eyes' })).toBe('My EYES!')
})
