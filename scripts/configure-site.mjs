import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Run after the final public URL is known. No network requests are made.
export function configureSite(rootDirectory, publicUrl) {
  const base = new URL(publicUrl);
  if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash) {
    throw new Error('Provide an HTTPS site-root URL with no credentials, query, or hash.');
  }
  if (/\.html?$/i.test(base.pathname)) throw new Error('Provide the site root, not an HTML page URL.');
  if (!base.pathname.endsWith('/')) base.pathname += '/';
  const imageUrl = new URL('assets/social-preview.png', base).href;
  const replacements = [];
  for (const [filename, pagePath] of [['index.html', ''], ['pitch/index.html', 'pitch/']]) {
    const filenamePath = path.join(rootDirectory, filename);
    let html = fs.readFileSync(filenamePath, 'utf8');
    const pageUrl = new URL(pagePath, base).href;
    const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
    html = html.replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/g, `$1${escape(imageUrl)}$2`);
    html = html.replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/g, `$1${escape(imageUrl)}$2`);
    html = html.replace(/\s*<meta\s+property="og:url"\s+content="[^"]*"\s*>/g, '');
    html = html.replace(/\s*<link\s+rel="canonical"\s+href="[^"]*"\s*>/g, '');
    html = html.replace('</head>', `  <meta property="og:url" content="${escape(pageUrl)}">\n  <link rel="canonical" href="${escape(pageUrl)}">\n</head>`);
    replacements.push([filenamePath, html]);
  }
  for (const [filenamePath, html] of replacements) fs.writeFileSync(filenamePath, html);
  return { siteUrl: base.href, imageUrl, pages: replacements.map(([filenamePath]) => filenamePath) };
}

const thisFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === thisFile) {
  const args = process.argv.slice(2);
  if (args.length !== 2 || args[0] !== '--site-url') {
    console.error('Usage: node scripts/configure-site.mjs --site-url https://your-domain.example/portfolio/');
    process.exitCode = 1;
  } else {
    try {
      const result = configureSite(path.resolve(path.dirname(thisFile), '..'), args[1]);
      console.log(`Configured absolute sharing and canonical URLs for ${result.pages.length} pages.`);
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}
