import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Stripped Head and Share Metadata Setup', () => {
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
  const organiserLoginContent = fs.readFileSync(
    path.join(__dirname, '..', 'app', 'organiser', 'login', 'page.tsx'),
    'utf8'
  );
  const robotsContent = fs.readFileSync(
    path.join(__dirname, '..', 'app', 'robots.ts'),
    'utf8'
  );
  const sitemapContent = fs.readFileSync(
    path.join(__dirname, '..', 'app', 'sitemap.ts'),
    'utf8'
  );

  it('omits page title, description, and viewport from root layout', () => {
    expect(rootLayoutContent).not.toMatch(/title:/);
    expect(rootLayoutContent).not.toMatch(/description:/);
    expect(rootLayoutContent).not.toMatch(/export const viewport/);
    expect(rootLayoutContent).not.toMatch(/themeColor/);
  });

  it('omits openGraph, twitter, icons, and manifest links from root layout', () => {
    expect(rootLayoutContent).not.toMatch(/openGraph:/);
    expect(rootLayoutContent).not.toMatch(/twitter:/);
    expect(rootLayoutContent).not.toMatch(/manifest:/);
    expect(rootLayoutContent).not.toMatch(/icons:/);
  });

  it('omits JSON-LD structured data from layout', () => {
    expect(rootLayoutContent).not.toMatch(/application\/ld\+json/);
  });

  it('configures canonical link in root layout', () => {
    expect(rootLayoutContent).toContain("canonical: '/'");
  });

  it('omits metadata export from home page to prevent title rendering on share', () => {
    expect(homePageContent).not.toMatch(/export const metadata/);
  });

  it('retains metadataBase and robots configuration in root layout', () => {
    expect(rootLayoutContent).toContain('metadataBase: new URL(siteUrl)');
    expect(rootLayoutContent).toContain('index: true');
    expect(rootLayoutContent).toContain('follow: true');
  });

  it('keeps organiser login page hidden from Google with its own tab title', () => {
    expect(organiserLoginContent).toContain('title: PAGE_NAMES.organiserLogin');
    expect(organiserLoginContent).toMatch(/index:\s*false/);
    expect(organiserLoginContent).toMatch(/follow:\s*false/);
    expect(robotsContent).toContain("disallow: ['/organiser/', '/event/']");
  });

  it('includes sitemap and robots routes with canonical URLs', () => {
    expect(robotsContent).toContain('sitemap.xml');
    expect(sitemapContent).toContain('https://metvent.vercel.app');
  });

  it('sets page title and canonical link on join page', () => {
    expect(joinPageContent).toContain('title: PAGE_NAMES.join');
    expect(joinPageContent).toContain("canonical: '/join'");
  });
});

