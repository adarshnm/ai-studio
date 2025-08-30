import { cn } from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('combines classes correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('merges tailwind classes correctly', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4')
    })

    it('handles conditional classes', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional')
      expect(cn('base', false && 'conditional')).toBe('base')
    })

    it('handles arrays', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar')
    })

    it('handles objects', () => {
      expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
    })

    it('handles null and undefined values', () => {
      expect(cn('foo', null, undefined, 'bar')).toBe('foo bar')
    })

    it('handles empty input', () => {
      expect(cn()).toBe('')
    })

    it('handles complex combinations', () => {
      const result = cn(
        'base-class',
        { 'conditional-true': true, 'conditional-false': false },
        ['array-class-1', 'array-class-2'],
        null,
        undefined,
        'final-class',
      )
      expect(result).toBe(
        'base-class conditional-true array-class-1 array-class-2 final-class',
      )
    })
  })
})
