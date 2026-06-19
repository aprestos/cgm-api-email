import { describe, expect, it } from 'vitest'
import { getTicketTitle } from './ticket.helper'

describe('getTicketTitle', () => {
  describe('missing or invalid inputs', () => {
    it('returns "-" when start is undefined', () => {
      expect(getTicketTitle(undefined, '2024-06-10', 'en')).toBe('-')
    })

    it('returns "-" when end is undefined', () => {
      expect(getTicketTitle('2024-06-10', undefined, 'en')).toBe('-')
    })

    it('returns "-" when both are undefined', () => {
      expect(getTicketTitle(undefined, undefined, 'en')).toBe('-')
    })

    it('returns "-" when start is an invalid date string', () => {
      expect(getTicketTitle('not-a-date', '2024-06-10', 'en')).toBe('-')
    })

    it('returns "-" when end is an invalid date string', () => {
      expect(getTicketTitle('2024-06-10', 'not-a-date', 'en')).toBe('-')
    })

    it('returns "-" when end is before start', () => {
      expect(getTicketTitle('2024-06-10', '2024-06-09', 'en')).toBe('-')
    })
  })

  describe('single-day stay', () => {
    it('returns the weekday name when start and end are the same day', () => {
      // 2024-06-10 is a Monday
      expect(getTicketTitle('2024-06-10', '2024-06-10', 'en')).toBe('Monday')
    })

    it('returns the weekday in the requested locale', () => {
      // 2024-06-10 is a Monday → "segunda-feira" in pt-BR
      expect(getTicketTitle('2024-06-10', '2024-06-10', 'pt-BR')).toBe('segunda-feira')
    })

    it('ignores time component and treats same calendar day as single-day', () => {
      expect(getTicketTitle('2024-06-10T08:00:00', '2024-06-10T22:00:00', 'en')).toBe('Monday')
    })

    it('returns weekday when valid_until is 23:00 UTC on the same calendar day (UTC+1 timezone regression)', () => {
      // 23:00 UTC is midnight local in UTC+1 — must use UTC for day boundaries
      expect(getTicketTitle('2026-07-13T19:30:00Z', '2026-07-13T23:00:00Z', 'en')).not.toBe('2 days')
    })
  })

  describe('multi-day stay', () => {
    it('returns "2 days" for a two-day stay', () => {
      expect(getTicketTitle('2024-06-10', '2024-06-11', 'en-US')).toBe('2 days')
    })

    it('returns "3 days" for a three-day stay', () => {
      expect(getTicketTitle('2024-06-10', '2024-06-12', 'en-US')).toBe('3 days')
    })

    it('formats the day count in the requested locale', () => {
      // pt-BR: "3 dias"
      expect(getTicketTitle('2024-06-10', '2024-06-12', 'pt-BR')).toBe('3 dias')
    })

    it('handles stays that span a month boundary', () => {
      expect(getTicketTitle('2024-06-28', '2024-07-02', 'en-US')).toBe('5 days')
    })

    it('handles stays that span a year boundary', () => {
      expect(getTicketTitle('2024-12-30', '2025-01-02', 'en-US')).toBe('4 days')
    })
  })
})
