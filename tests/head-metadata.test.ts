import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Shared Link and Head Metadata', () => {
  const rootLayoutContent = fs.readFileSync(
    path.join(__dirname, '..', 'app', 'layout.tsx'),
    'utf8'
  );
  const homePageContent = fs.readFileSync(
    path.join(__dirname, '..', 'app', 'page.tsx'),
    'utf8'
  );
  const joinPageContent = fs.readFileSync(
    path.join(__dirname, '..', 'app', 'join', 'page.tsx'),
    'utf8'
  );
  const robotsContent = fs.readFileSync(
    path.join(__dirname, '..', 'app', 'robots.ts'),
    'utf8'
  );

  it('omits page title, description, and viewport from root layout', () => {
    expect(rootLayoutContent).not.toMatch(/title:/);
    expect(rootLayoutContent).not.toMatch(/description:/);
    expect(rootLayoutContent).not.toMatch(/export const viewport/);
    expect(rootLayoutContent).not.toMatch(/themeColor/);
  });

  it('omits openGraph, twitter, title, and description from home page', () => {
    expect(homePageContent).not.toMatch(/openGraph:/);
    expect(homePageContent).not.toMatch(/twitter:/);
    expect(homePageContent).not.toMatch(/title:/);
    expect(homePageContent).not.toMatch(/description:/);
    expect(homePageContent).not.toMatch(/icon\.png/);
  });

  it('omits page title and description from join page', () => {
    expect(joinPageContent).not.toMatch(/title:/);
    expect(joinPageContent).not.toMatch(/description:/);
  });

  it('ensures app/icon.svg and app/icon.png do not exist', () => {
    const iconSvgPath = path.join(__dirname, '..', 'app', 'icon.svg');
    const iconPngPath = path.join(__dirname, '..', 'app', 'icon.png');
    expect(fs.existsSync(iconSvgPath)).toBe(false);
    expect(fs.existsSync(iconPngPath)).toBe(false);
  });

  it('disallows organiser in robots.ts to keep login hidden from Google', () => {
    expect(robotsContent).toMatch(/disallow:\s*\[['"]\/organiser\/['"]\]/);
  });

  it('keeps default robots setting to noindex and nofollow in root layout', () => {
    expect(rootLayoutContent).toMatch(/index:\s*false/);
    expect(rootLayoutContent).toMatch(/follow:\s*false/);
  });
});
