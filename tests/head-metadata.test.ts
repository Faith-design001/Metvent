import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Premium Head and Share Metadata Setup', () => {
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
  const manifestContent = fs.readFileSync(
    path.join(__dirname, '..', 'app', 'manifest.ts'),
    'utf8'
  );

  it('configures strong default title and inner page title template in root layout', () => {
    expect(rootLayoutContent).toContain("default: 'Metvent — Keep a conversation going'");
    expect(rootLayoutContent).toContain("template: '%s | Metvent'");
  });

  it('configures ~150 char description, search keywords, and web app manifest in layout', () => {
    expect(rootLayoutContent).toContain('description:');
    expect(rootLayoutContent).toContain('keywords:');
    expect(rootLayoutContent).toContain("manifest: '/manifest.webmanifest'");
  });

  it('configures light and dark purple browser theme colors in viewport', () => {
    expect(rootLayoutContent).toContain('#5145e5');
    expect(rootLayoutContent).toContain('#312e81');
    expect(rootLayoutContent).toContain('prefers-color-scheme: light');
    expect(rootLayoutContent).toContain('prefers-color-scheme: dark');
  });

  it('configures Open Graph and Twitter summary_large_image previews in layout', () => {
    expect(rootLayoutContent).toContain('openGraph:');
    expect(rootLayoutContent).toContain("card: 'summary_large_image'");
    expect(rootLayoutContent).toContain('/opengraph-image.png');
  });

  it('embeds JSON-LD structured data for WebApplication and Organization', () => {
    expect(rootLayoutContent).toContain('application/ld+json');
    expect(rootLayoutContent).toContain('WebApplication');
    expect(rootLayoutContent).toContain('Organization');
  });

  it('sets absolute title and canonical link on home page', () => {
    expect(homePageContent).toContain("absolute: 'Metvent — Keep a conversation going'");
    expect(homePageContent).toContain("canonical: '/'");
  });

  it('sets page title and canonical link on join page', () => {
    expect(joinPageContent).toContain('title: PAGE_NAMES.join');
    expect(joinPageContent).toContain("canonical: '/join'");
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
    expect(manifestContent).toContain('standalone');
  });

  it('verifies existence of share picture and icon assets', () => {
    const ogPng = path.join(__dirname, '..', 'public', 'opengraph-image.png');
    const ogJpg = path.join(__dirname, '..', 'public', 'opengraph-image.jpg');
    const iconSvg = path.join(__dirname, '..', 'public', 'icon.svg');
    const iconPng = path.join(__dirname, '..', 'public', 'icon.png');
    const appleIcon = path.join(__dirname, '..', 'public', 'apple-icon.png');
    const icon192 = path.join(__dirname, '..', 'public', 'icon-192.png');
    const icon512 = path.join(__dirname, '..', 'public', 'icon-512.png');

    expect(fs.existsSync(ogPng)).toBe(true);
    expect(fs.existsSync(ogJpg)).toBe(true);
    expect(fs.existsSync(iconSvg)).toBe(true);
    expect(fs.existsSync(iconPng)).toBe(true);
    expect(fs.existsSync(appleIcon)).toBe(true);
    expect(fs.existsSync(icon192)).toBe(true);
    expect(fs.existsSync(icon512)).toBe(true);
  });
});
