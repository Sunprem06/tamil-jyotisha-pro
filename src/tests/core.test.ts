import { describe, it, expect } from 'vitest';
import { sanitizeInput } from '../lib/sanitize';

const TAMIL_DAYS = ['ஞாயிற்றுக்கிழமை','திங்கட்கிழமை','செவ்வாய்க்கிழமை','புதன்கிழமை','வியாழக்கிழமை','வெள்ளிக்கிழமை','சனிக்கிழமை'];

describe('Tamil Day Mapping', () => {
  it('returns correct Tamil day for each JS day index', () => {
    expect(TAMIL_DAYS[0]).toBe('ஞாயிற்றுக்கிழமை');
    expect(TAMIL_DAYS[5]).toBe('வெள்ளிக்கிழமை');
    expect(TAMIL_DAYS[6]).toBe('சனிக்கிழமை');
  });
  it('returns 7 days total', () => {
    expect(TAMIL_DAYS.length).toBe(7);
  });
});

describe('Input Sanitization', () => {
  it('removes dangerous characters', () => {
    const dirty = '<script>alert("xss")</script>';
    const clean = sanitizeInput(dirty);
    expect(clean).not.toContain('<');
    expect(clean).not.toContain('>');
  });
  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });
  it('truncates to 500 chars', () => {
    const long = 'a'.repeat(600);
    expect(sanitizeInput(long).length).toBe(500);
  });
});

describe('Navagraha Order', () => {
  const PLANETS = ['சூரியன்','சந்திரன்','செவ்வாய்','புதன்','குரு','சுக்கிரன்','சனி','ராகு','கேது'];
  it('has exactly 9 planets', () => { expect(PLANETS.length).toBe(9); });
  it('Saturn is 7th (index 6)', () => { expect(PLANETS[6]).toBe('சனி'); });
  it('Rahu is 8th (index 7)', () => { expect(PLANETS[7]).toBe('ராகு'); });
});
