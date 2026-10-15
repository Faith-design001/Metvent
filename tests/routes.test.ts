import { describe, expect, it } from 'vitest';
import { PAGE_NAMES } from '../lib/routes';

describe('PAGE_NAMES', () => {
  it('defines the correct page names for all primary routes', () => {
    expect(PAGE_NAMES.home).toBe('Home');
    expect(PAGE_NAMES.join).toBe('Join');
    expect(PAGE_NAMES.card).toBe('Card');
    expect(PAGE_NAMES.board).toBe('Board');
    expect(PAGE_NAMES.room).toBe('Room Right Now');
    expect(PAGE_NAMES.opener).toBe('Opener');
    expect(PAGE_NAMES.people).toBe('Who I Met');
    expect(PAGE_NAMES.organiser).toBe('Organiser Dashboard');
    expect(PAGE_NAMES.organiserLogin).toBe('Organiser Sign In');
  });

  it('defines a four word tagline from PRD section 4', () => {
    const tagline = 'Keep a conversation going';
    const words = tagline.split(/\s+/);
    expect(words).toHaveLength(4);
    expect(words).toEqual(['Keep', 'a', 'conversation', 'going']);
  });
});

