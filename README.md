# Lynguist

A lightweight, type-safe internationalization (i18n) library for JavaScript/TypeScript applications with Laravel translation format support.

> For Laravel version, see [vixen-tech/laravel-lynguist](https://github.com/vixen-tech/laravel-lynguist).

Inspired by [laravel-translator-js](https://github.com/sergix44/laravel-translator-js) and [lingua](https://github.com/cyberwolf-studio/lingua).

## Features

- **Multi-language support** - 60+ languages with proper pluralization rules
- **Runtime locale switching** - Dynamically change languages with event notifications
- **Smart placeholders** - Laravel-style variable replacement with case transformation
- **Advanced pluralization** - Pipe-separated and interval notation support
- **Vite integration** - Virtual module plugin for loading JSON translation files (supports any framework)
- **Type-safe** - Full TypeScript support with typed translation keys

## Installation

```bash
npm install @vixen-tech/lynguist
```
```bash
yarn install @vixen-tech/lynguist
```

## Quick Start

### With Vite

**1. Configure the Vite plugin:**

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { lynguist } from '@vixen-tech/lynguist/vite'

export default defineConfig({
    plugins: [
        lynguist({
            langPath: 'lang', // default
            additionalLangPaths: ['vendor/package/lang'] // optional
        })
    ]
})
```

**2. Create translation files:**

File: `/lang/en.json`

```json
{
    "greeting": "Hello :name",
    "items": "One item|:count items",
    "welcome": "Hello World"
}
```

> Works best with its Laravel counterpart: [vixen-tech/laravel-lynguist](https://github.com/vixen-tech/laravel-lynguist).

**3. Use in your application:**

```typescript
import { __, setLocale } from '@vixen-tech/lynguist'

// Simple translation
__('welcome') // "Hello World"

// With placeholder
__('greeting', { name: 'John' }) // "Hello John"

// With pluralization
__('items', 5) // "5 items"

// Switch locale
setLocale('de')
```

### Manual Setup

```typescript
import { Lynguist, __ } from '@vixen-tech/lynguist'

Lynguist({
    locale: 'en',
    translations: {
        welcome: 'Hello World',
        greeting: 'Hello :name'
    }
})

__('welcome') // "Hello World"
```

## Inertia.js

To reactively switch locale, you can create a wrapper component that assigns current locale to document's `lang` attribute:

```typescript
const locale = usePage().props.locale

if (typeof window !== 'undefined') {
    document.documentElement.lang = locale
}
```

Here's what it looks like in React:

```typescript jsx
export function Wrapper({ children }: PropsWithChildren) {
    const locale = usePage<SharedData>().props.locale

    if (typeof window !== 'undefined') {
        document.documentElement.lang = locale
    }

    return <>{children}</>
}
```

## Placeholders

Lynguist supports Laravel-style placeholder replacement with automatic case transformation:

```typescript
const translations = {
    greeting: 'Hello :name',
    welcome: 'Welcome :Name',       // capitalized
    shout: 'HEY :NAME'              // uppercase
}

__('greeting', { name: 'John' })    // "Hello John"
__('welcome', { Name: 'john' })     // "Welcome John"
__('shout', { NAME: 'john' })       // "HEY JOHN"
```

## Pluralization

### Basic Pluralization

Use pipe-separated values for simple plural forms:

```typescript
const translations = {
    items: 'One item|:count items'
}

__('items', 1)  // "One item"
__('items', 5)  // "5 items"
```

### Interval Notation

For more control, use interval notation:

```typescript
const translations = {
    apples: '{0} No apples|{1} One apple|[2,*] :count apples'
}

__('apples', 0)   // "No apples"
__('apples', 1)   // "One apple"
__('apples', 5)   // "5 apples"
```

### Language-Specific Rules

Lynguist handles complex pluralization rules for languages like Russian, Arabic, and Polish:

```typescript
// Russian has 3 plural forms
const translations = {
    apples: ':count яблоко|:count яблока|:count яблок'
}

__('apples', 1)   // "1 яблоко"
__('apples', 2)   // "2 яблока"
__('apples', 5)   // "5 яблок"
__('apples', 21)  // "21 яблоко"
```

## API Reference

### `__(key, countOrReplace?, replace?)`

Main translation function supporting both simple translations and pluralization.

```typescript
__('welcome')                        // Simple translation
__('greeting', { name: 'John' })     // With placeholders
__('items', 5)                       // With count
__('items', 5, { type: 'file' })     // With count and placeholders
```

### `trans(key, replace?)`

Simple translation without pluralization.

```typescript
trans('greeting', { name: 'John' })  // "Hello John"
```

### `transChoice(key, count, replace?)`

Plural-aware translation.

```typescript
transChoice('items', 5)              // "5 items"
```

### `setLocale(locale)`

Change the current language.

```typescript
setLocale('de')
```

### `getLocale()`

Get the current language code.

```typescript
getLocale()  // "en"
```

### `getAvailableLocales()`

Get all available language codes.

```typescript
getAvailableLocales()  // ["en", "de", "fr"]
```

### `getTranslations(locale?)`

Get translations for a specific or current locale.

```typescript
getTranslations()       // Current locale translations
getTranslations('de')   // German translations
```

### `onLocaleChange(callback)`

Subscribe to locale change events. Returns an unsubscribe function.

```typescript
const unsubscribe = onLocaleChange((newLocale, previousLocale) => {
    console.log(`Changed from ${previousLocale} to ${newLocale}`)
})

// Later: stop listening
unsubscribe()
```

## Vite Plugin Options

| Option                | Type       | Default     | Description                            |
|-----------------------|------------|-------------|----------------------------------------|
| `langPath`            | `string`   | `'lang'`    | Path to the translation directory      |
| `additionalLangPaths` | `string[]` | `undefined` | Additional paths for translation files |

## Supported Languages

Lynguist supports 60+ languages with proper pluralization rules including:

Afrikaans, Amharic, Arabic, Belarusian, Bengali, Bosnian, Bulgarian, Catalan, Czech, Welsh, Danish, German, Greek, English, Esperanto, Spanish, Estonian, Basque, Persian, Finnish, Filipino, French, Irish, Galician, Hebrew, Hindi, Croatian, Hungarian, Armenian, Icelandic, Italian, Japanese, Korean, Lithuanian, Latvian, Macedonian, Mongolian, Maltese, Dutch, Norwegian, Polish, Portuguese, Romanian, Russian, Slovak, Slovenian, Serbian, Swedish, Tamil, Thai, Turkish, Ukrainian, Urdu, Vietnamese, Chinese, and more.

## License

ISC
