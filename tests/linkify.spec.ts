import { linkify } from '@/index'

it('replaces single placeholder with anchor tag', () => {
    expect(linkify('Click [here] to continue', 'https://example.com')).toBe(
        'Click <a href="https://example.com">here</a> to continue',
    )
})

it('replaces multiple placeholders with corresponding URLs', () => {
    expect(linkify('[First] and [second] links', ['https://a.com', 'https://b.com'])).toBe(
        '<a href="https://a.com">First</a> and <a href="https://b.com">second</a> links',
    )
})

it('leaves unmatched placeholders as-is when fewer URLs than placeholders', () => {
    expect(linkify('[First] and [second] and [third]', ['https://a.com'])).toBe(
        '<a href="https://a.com">First</a> and [second] and [third]',
    )
})

it('handles escaped brackets literally', () => {
    expect(linkify('Use \\[brackets\\] literally', 'https://example.com')).toBe('Use [brackets] literally')
})

it('handles mix of escaped and unescaped brackets', () => {
    expect(linkify('Click [here] or use \\[code\\]', 'https://example.com')).toBe(
        'Click <a href="https://example.com">here</a> or use [code]',
    )
})

it('handles text with no placeholders', () => {
    expect(linkify('No links here', 'https://example.com')).toBe('No links here')
})

it('handles empty text', () => {
    expect(linkify('', 'https://example.com')).toBe('')
})

it('handles placeholder at start of string', () => {
    expect(linkify('[Click me] for more', 'https://example.com')).toBe(
        '<a href="https://example.com">Click me</a> for more',
    )
})

it('handles placeholder at end of string', () => {
    expect(linkify('Go to [homepage]', 'https://example.com')).toBe('Go to <a href="https://example.com">homepage</a>')
})

it('handles consecutive placeholders', () => {
    expect(linkify('[one][two]', ['https://a.com', 'https://b.com'])).toBe(
        '<a href="https://a.com">one</a><a href="https://b.com">two</a>',
    )
})

it('uses single URL for first placeholder only when array expected', () => {
    expect(linkify('[first] and [second]', 'https://only.com')).toBe(
        '<a href="https://only.com">first</a> and [second]',
    )
})
