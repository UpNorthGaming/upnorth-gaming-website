const LOGO = '__LOGO_BASE64__';
const HERO = '__HERO_BASE64__';
const AIDAN = '__AIDAN_BASE64__';
const ANTHONY = '__ANTHONY_BASE64__';
const images = new Map([
  ['/brand/logo.png', LOGO],
  ['/brand/winter.jpg', HERO],
  ['/studio/aidan-follestad.jpg', AIDAN],
  ['/studio/anthony-cole.jpg', ANTHONY],
]);
const platforms = ['Mobile', 'Console', 'board.fun'];
const types = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']);
const maximumUpload = 50 * 1024 * 1024;
const uuid = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/;
const escape = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeHeaders = {'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'strict-origin-when-cross-origin'};
const json = (data, status = 200) => Response.json(data, {status, headers: {...safeHeaders, 'Cache-Control':'no-store'}});
const error = (message, status) => json({error:message}, status);

function isAdmin(request, env) {
  const email = request.headers.get('oai-authenticated-user-email')?.trim().toLowerCase();
  const allowed = (env.ADMIN_EMAILS ?? '').split(',').map(value => value.trim().toLowerCase());
  return Boolean(request.headers.get('oai-authenticated-user-id') && email && allowed.includes(email));
}

function page(title, contents, script = '', admin = false) {
  return new Response(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><meta name="description" content="UpNorth Gaming is a two-person independent game studio building for mobile, console, and board.fun.">
<meta name="theme-color" content="#0b1421"><link rel="icon" href="/brand/logo.png"><style>${CSS}</style></head>
<body><a class="skip" href="#main">Skip to content</a>
<header class="masthead"><div class="wrap mast-inner">
<a class="brand" href="/" aria-label="UpNorth Gaming home"><img src="/brand/logo.png" alt="" width="42" height="39"><span>UpNorth <strong>Gaming</strong></span></a>
<nav aria-label="Main navigation"><a href="/#platforms">Platforms</a><a href="/#updates">Devlog</a><a href="/#studio">Studio</a></nav>
</div></header>
${contents}
<footer><div class="wrap footer-inner"><span>© ${new Date().getUTCFullYear()} UpNorth Gaming</span><a href="${admin ? '/' : '/admin'}">${admin ? 'View website' : 'Studio sign-in'}</a></div></footer>
${script ? '<script type="module">' + script + '</script>' : ''}</body></html>`, {
    headers:{...safeHeaders, 'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store',
      'Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self'; media-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'"}
  });
}

async function listUpdates(bucket) {
  const updates = [];
  let cursor;
  do {
    const result = await bucket.list({prefix:'updates/', include:['customMetadata'], cursor});
    updates.push(...result.objects.map(object => ({id:object.key.slice(8), date:object.customMetadata?.date ?? '', title:object.customMetadata?.title ?? 'Development update'})));
    cursor = result.truncated ? result.cursor : undefined;
  } while (cursor);
  return updates.sort((a, b) => b.date.localeCompare(a.date));
}

async function readUpdate(bucket, id) {
  const object = await bucket.get('updates/' + id);
  return object && {...await object.json(), version:object.etag};
}

function showUpdate(update) {
  const media = update.media.map(item => item.type.startsWith('video/')
    ? `<video controls playsinline preload="metadata" aria-label="${escape(item.description)}" src="/media/${item.id}"></video>`
    : `<img loading="lazy" src="/media/${item.id}" alt="${escape(item.description)}">`).join('');
  const date = new Date(update.date).toLocaleDateString('en-US', {month:'long',day:'numeric',year:'numeric',timeZone:'UTC'});
  return `<article class="update"><div class="update-content"><p class="meta"><time datetime="${escape(update.date)}">${date}</time>${update.platform ? ' · '+escape(update.platform) : ''}</p>
  <h3>${escape(update.title)}</h3><p class="body-copy">${escape(update.body)}</p></div>${media ? '<div class="media-grid">' + media + '</div>' : ''}</article>`;
}

const mobile = '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 17h2"/>';
const consoleIcon = '<path d="M8 7h8c2.3 0 3.7 1.3 4.4 3.5l1.1 4c.6 2.4-1.5 3.8-3.1 2.5L15 14H9l-3.4 3c-1.6 1.3-3.7-.1-3.1-2.5l1.1-4C4.3 8.3 5.7 7 8 7Z"/><path d="M7 9v4m-2-2h4m6 0h.01m3 1h.01"/>';
const board = '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01" stroke-width="2.7"/>';
function icon(path) {
  return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

async function home(env) {
  const list = await listUpdates(env.BUCKET);
  const updates = (await Promise.all(list.slice(0, 8).map(item => readUpdate(env.BUCKET, item.id)))).filter(Boolean);
  return page('UpNorth Gaming | Independent Game Studio', `<main id="main">
<section class="hero"><div class="wrap hero-inner">
<div class="hero-copy"><p class="eyebrow">Independent Game Studio</p>
<h1>Games built<br> <em>up north.</em></h1>
<p class="intro">We’re a two-person studio making games for mobile, console, and board.fun.</p>
<a class="button" href="#updates">Read the devlog</a></div>
<img class="hero-logo" src="/brand/logo.png" width="1312" height="1199" alt="UpNorth Gaming compass and controller logo with ice-capped lettering" fetchpriority="high">
</div></section>
<section class="platforms section" id="platforms"><div class="wrap">
<h2>Where we build</h2><div class="platform-grid">
<article>${icon(mobile)}<h3>Mobile</h3><p>Games for phones and tablets.</p></article>
<article>${icon(consoleIcon)}<h3>Console</h3><p>Games built around the controller.</p></article>
<article>${icon(board)}<h3>board.fun</h3><p>Games for the digital tabletop.</p></article>
</div></div></section>
<section class="section devlog" id="updates"><div class="wrap"><p class="eyebrow">From the studio</p><h2>Development log</h2>
${updates.length ? updates.map(showUpdate).join('') : '<p class="empty">Development updates, screenshots, and gameplay clips will appear here as we share them.</p>'}
${list.length > 8 ? '<p><a href="/updates">Browse all updates</a></p>' : ''}
</div></section>
<section class="section about" id="studio"><div class="wrap"><h2>About the studio</h2>
<p class="studio-intro">UpNorth Gaming is an independent, two-person game studio. We develop for handheld screens, consoles, and the digital tabletop.</p>
<section class="developers" aria-labelledby="developers"><h2 id="developers">Meet the developers</h2>
<div class="developer-grid">
<article class="developer">
${AIDAN ? '<img src="/studio/aidan-follestad.jpg" alt="Aidan Follestad looking through his camera" loading="lazy" decoding="async">' : ''}
<div class="developer-copy"><h3>Aidan Follestad</h3>
<p>Aidan is a full-stack developer at Square and an avid PS5 gamer. He enjoys photography and loves riding his Triumph Street Triple RS.</p>
<p><strong>Favorite games</strong> GTA 6, Marvel Rivals, and Zelda</p></div>
</article>
<article class="developer">
<img src="/studio/anthony-cole.jpg" alt="Anthony Cole riding his Indian Scout Sport" loading="lazy" decoding="async">
<div class="developer-copy"><h3>Anthony Cole</h3>
<p>Anthony is a girl dad and an avid PS5 gamer. He enjoys photography and loves riding his Indian Scout Sport.</p>
<p><strong>Favorite games</strong> 7 Days To Die, GTA 6, and Call of Duty</p></div>
</article>
</div></section></div></section>
</main>`);
}

async function archive(request, env) {
  const number = Math.max(1, Number.parseInt(new URL(request.url).searchParams.get('page'), 10) || 1);
  const list = await listUpdates(env.BUCKET);
  const posts = (await Promise.all(list.slice((number - 1) * 12, number * 12).map(item => readUpdate(env.BUCKET, item.id)))).filter(Boolean);
  return page('Development log | UpNorth Gaming', `<main class="wrap section" id="main"><h1 class="page-title">Development log</h1>
${posts.length ? posts.map(showUpdate).join('') : '<p>No updates on this page.</p>'}
<nav aria-label="Development log pages">${number > 1 ? `<a href="/updates?page=${number-1}">Newer updates</a>` : ''} ${list.length > number * 12 ? `<a href="/updates?page=${number+1}">Older updates</a>` : ''}</nav></main>`);
}

function adminPage(request, env) {
  const account = request.headers.get('oai-authenticated-user-id');
  if (!isAdmin(request, env)) {
    return page('Studio sign-in | UpNorth Gaming', `<main class="wrap section" id="main"><h1 class="page-title">Studio sign-in</h1>
<p>Sign in with your approved UpNorth Gaming admin account.</p>
${account ? '<p>This account does not have admin access.</p><a href="/signout-with-chatgpt?return_to=%2Fadmin" target="_top">Sign out</a>' : '<a class="button" href="/signin-with-chatgpt?return_to=%2Fadmin" target="_top">Sign in with ChatGPT</a>'}</main>`);
  }
  return page('Studio admin | UpNorth Gaming', `<main class="wrap section" id="main">
<div class="admin-head"><div><p class="eyebrow">UpNorth Gaming</p><h1 class="page-title">Studio admin</h1></div><a href="/signout-with-chatgpt?return_to=%2F" target="_top">Sign out</a></div>
<div class="workspace"><aside class="panel"><h2>Development updates</h2><button id="new" type="button">New update</button><ul id="entries"></ul></aside>
<form id="editor" class="panel"><h2 id="form-title">New update</h2>
<label>Title<input name="title" required maxlength="120"></label>
<label>Platform<select name="platform"><option value="">Studio-wide</option>${platforms.map(platform => '<option>'+platform+'</option>').join('')}</select></label>
<label>Update<textarea name="body" rows="8" required maxlength="12000"></textarea></label>
<fieldset><legend>Photos and gameplay</legend><p class="help">JPG, PNG, WebP, GIF, MP4 or WebM. Up to 50 MiB each.</p>
<ul id="attachments"></ul>
<label>Add files<input id="files" type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"></label>
</fieldset><button id="publish" type="submit">Publish update</button>
<p id="status" role="status" aria-live="polite"></p></form></div></main>`, ADMIN_JS, true);
}

async function adminApi(request, env, path) {
  if (!isAdmin(request, env)) return error('Admin access required.', 403);
  const bucket = env.BUCKET;
  if (request.method !== 'GET' && request.headers.get('origin') !== new URL(request.url).origin) {
    return error('Request origin is invalid.', 403);
  }

  if (path === '/api/admin/media' && request.method === 'POST') {
    const type = request.headers.get('content-type');
    const length = Number(request.headers.get('content-length'));
    if (!types.has(type)) return error('Choose a supported photo or video format.', 415);
    if (!Number.isSafeInteger(length) || length <= 0 || length > maximumUpload || !request.body) {
      return error('Choose a file between 1 byte and 50 MiB.', 413);
    }
    const id = crypto.randomUUID();
    await bucket.put('media/' + id, request.body, {httpMetadata:{contentType:type}});
    return json({id,type}, 201);
  }

  const id = path.slice('/api/admin/updates/'.length);
  if (path === '/api/admin/updates' && request.method === 'GET') {
    const list = await listUpdates(bucket);
    return json(list.map(({id, date, title}) => ({id,date,title})));
  }
  if (!path.startsWith('/api/admin/updates/') || !uuid.test(id)) return error('Route not found.', 404);
  if (request.method === 'GET') {
    const update = await readUpdate(bucket, id);
    return update ? json(update) : error('Update not found.', 404);
  }
  if (request.method !== 'PUT') return error('Method not allowed.', 405);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return error('Use JSON to save an update.', 415);
  if (Number(request.headers.get('content-length')) > 96 * 1024) return error('The update is too long.', 413);

  let input;
  try { input = await request.json(); } catch { return error('Invalid update data.', 400); }
  const title = typeof input?.title === 'string' ? input.title.trim() : '';
  const body = typeof input?.body === 'string' ? input.body.trim() : '';
  const {platform, media, version} = input ?? {};
  if (!title || title.length > 120 || !body || body.length > 12000 || !['', ...platforms].includes(platform)
      || !Array.isArray(media) || media.length > 12 || (version !== null && typeof version !== 'string')) {
    return error('Check the title, update, platform, and attachments. Up to 12 files are allowed.', 400);
  }
  const attachments = [];
  for (const item of media) {
    if (!uuid.test(item?.id ?? '') || typeof item.description !== 'string' || !item.description.trim() || item.description.length > 250) {
      return error('Each attachment needs a short description.', 400);
    }
    const object = await bucket.head('media/' + item.id);
    if (!object || !types.has(object.httpMetadata?.contentType)) return error('An attachment could not be found.', 400);
    attachments.push({id:item.id,type:object.httpMetadata.contentType,description:item.description.trim()});
  }

  const existing = await readUpdate(bucket, id);
  if ((existing?.version ?? null) !== version) return error('This update changed since you opened it. Copy any unsaved edits and reopen the update.', 409);
  const date = existing?.date ?? new Date().toISOString();
  const update = {id,title,body,platform,media:attachments,date};
  const stored = await bucket.put('updates/' + id, JSON.stringify(update), {
    customMetadata:{date,title},
    onlyIf:version === null ? {etagDoesNotMatch:'*'} : {etagMatches:version}
  });
  return stored ? json({...update,version:stored.etag}, version === null ? 201 : 200)
    : error('This update changed while you were saving it. Copy any unsaved edits and reopen the update.', 409);
}

async function serveMedia(request, bucket, id) {
  const key = 'media/' + id;
  const range = request.headers.get('range');
  let selected;
  let headers;
  if (range && request.method === 'GET') {
    const metadata = await bucket.head(key);
    if (!metadata) return new Response('Not found', {status:404});
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    const start = match?.[1] ? Number(match[1]) : Math.max(0, metadata.size - Number(match?.[2]));
    const end = match?.[1] && match[2] ? Math.min(Number(match[2]), metadata.size-1) : metadata.size-1;
    if (!match || !Number.isSafeInteger(start) || start < 0 || start > end) {
      return new Response(null, {status:416,headers:{'Content-Range':'bytes */'+metadata.size}});
    }
    selected = {offset:start,length:end-start+1};
    headers = {'Content-Range':'bytes '+start+'-'+end+'/'+metadata.size};
  }
  const object = request.method === 'HEAD' ? await bucket.head(key) : await bucket.get(key, selected ? {range:selected} : undefined);
  if (!object) return new Response('Not found', {status:404});
  return new Response(object.body ?? null, {status:selected ? 206 : 200,headers:{
    ...safeHeaders, ...headers, 'Content-Type':object.httpMetadata.contentType, 'Accept-Ranges':'bytes',
    'Content-Length':String(selected?.length ?? object.size), 'Cache-Control':'public, max-age=31536000, immutable'
  }});
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    const read = ['GET','HEAD'].includes(request.method);
    try {
      const image = images.get(path);
      if (read && image) {
        return new Response(request.method === 'HEAD' ? null : Uint8Array.from(atob(image), c => c.charCodeAt(0)), {
          headers:{...safeHeaders,'Content-Type':path.endsWith('.png') ? 'image/png' : 'image/jpeg','Cache-Control':'public, max-age=86400'}
        });
      }
      if (read && path === '/admin') return adminPage(request, env);
      if (path.startsWith('/api/admin/')) return await adminApi(request, env, path);
      if (read && path === '/') return await home(env);
      if (read && path === '/updates') return await archive(request, env);
      if (read && path.startsWith('/media/') && uuid.test(path.slice(7))) return await serveMedia(request, env.BUCKET, path.slice(7));
      return new Response('Not found', {status:404});
    } catch (err) {
      console.error(path, err);
      return error('The site could not complete this request. Try again shortly.', 500);
    }
  }
};

const ADMIN_JS = String.raw`
const editor = document.querySelector('#editor');
const list = document.querySelector('#entries');
const attachments = document.querySelector('#attachments');
const files = document.querySelector('#files');
const status = document.querySelector('#status');
const publish = document.querySelector('#publish');
const create = document.querySelector('#new');
let id;
let version;
let media;
let busy = false;
let savedForm;

async function api(path, options) {
  const response = await fetch('/api/admin/' + path, options);
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'The request failed.');
  return result;
}

function fingerprint() {
  const {title, platform, body} = editor.elements;
  return JSON.stringify([title.value, platform.value, body.value,
    media.map(item => [item.id ?? item.file.name, item.description])]);
}

function mayClose() {
  return fingerprint() === savedForm || confirm('Discard your unsaved changes?');
}

function lock(value) {
  busy = value;
  for (const element of document.querySelectorAll('input, select, textarea, button')) element.disabled = value;
}

function renderMedia() {
  attachments.replaceChildren();
  for (const item of media) {
    const row = document.createElement('li');
    const label = document.createElement('label');
    const input = document.createElement('input');
    label.textContent = item.file?.name ?? (item.type.startsWith('video/') ? 'Gameplay clip' : 'Photo');
    input.type = 'text';
    input.required = true;
    input.maxLength = 250;
    input.placeholder = 'Describe this attachment';
    input.value = item.description;
    input.addEventListener('input', () => { item.description = input.value; });
    label.append(input);
    row.append(label);
    if (item.id) {
      const preview = document.createElement('a');
      preview.href = '/media/' + item.id;
      preview.target = '_blank';
      preview.rel = 'noopener';
      preview.textContent = 'Preview';
      row.append(preview);
    }
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Remove';
    remove.addEventListener('click', () => {
      media = media.filter(entry => entry !== item);
      renderMedia();
      files.focus();
    });
    row.append(remove);
    attachments.append(row);
  }
}

function openUpdate(update) {
  editor.reset();
  id = update?.id ?? crypto.randomUUID();
  version = update?.version ?? null;
  media = update?.media ?? [];
  editor.elements.title.value = update?.title ?? '';
  editor.elements.platform.value = update?.platform ?? '';
  editor.elements.body.value = update?.body ?? '';
  document.querySelector('#form-title').textContent = update ? 'Edit update' : 'New update';
  publish.textContent = update ? 'Save changes' : 'Publish update';
  status.textContent = '';
  renderMedia();
  savedForm = fingerprint();
}

async function refresh() {
  const entries = await api('updates');
  list.replaceChildren();
  for (const entry of entries) {
    const row = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = entry.title;
    button.addEventListener('click', async () => {
      if (busy || !mayClose()) return;
      lock(true);
      try {
        openUpdate(await api('updates/' + entry.id));
        lock(false);
        editor.elements.title.focus();
      } catch (err) { status.textContent = err.message; }
      finally { lock(false); }
    });
    row.append(button);
    list.append(row);
  }
  if (!entries.length) {
    const row = document.createElement('li');
    row.textContent = 'No published updates yet.';
    list.append(row);
  }
}

files.addEventListener('change', () => {
  const selected = Array.from(files.files);
  files.value = '';
  if (selected.length + media.length > 12 || selected.some(file => !file.size || file.size > 50 * 1024 * 1024 || !files.accept.split(',').includes(file.type))) {
    status.textContent = 'Choose up to 12 supported photos or gameplay clips, each 50 MiB or smaller.';
    return;
  }
  media.push(...selected.map(file => ({file, type:file.type, description:''})));
  status.textContent = '';
  renderMedia();
  attachments.querySelectorAll('input')[media.length - selected.length]?.focus();
});

create.addEventListener('click', () => {
  if (!busy && mayClose()) {
    openUpdate();
    editor.elements.title.focus();
  }
});

editor.addEventListener('submit', async event => {
  event.preventDefault();
  if (busy) return;
  const data = Object.fromEntries(new FormData(editor));
  lock(true);
  try {
    for (const [index, item] of media.entries()) {
      if (item.id) continue;
      status.textContent = 'Uploading attachment ' + (index + 1) + ' of ' + media.length + '…';
      const uploaded = await api('media', {method:'POST', headers:{'Content-Type':item.file.type}, body:item.file});
      Object.assign(item, uploaded);
    }
    status.textContent = 'Saving update…';
    const update = await api('updates/' + id, {method:'PUT', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({...data,version,media:media.map(({id,description}) => ({id,description}))})});
    openUpdate(update);
    status.textContent = 'Update is live on the website.';
    try { await refresh(); } catch { status.textContent += ' Refresh this page to reload the update list.'; }
  } catch (err) { status.textContent = err.message; }
  finally { lock(false); }
});

window.addEventListener('beforeunload', event => {
  if (busy || fingerprint() !== savedForm) event.preventDefault();
});

openUpdate();
refresh().catch(err => { status.textContent = err.message; });
`;

const CSS = `
:root{color-scheme:dark;--bg:#0b1421;--panel:#111f30;--soft:#18283b;--text:#f7f4ea;--muted:#bac9d9;--ice:#b8e5ff;--gold:#efba5e;--line:#2b3d52;font-family:Inter,system-ui,-apple-system,sans-serif}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--text);line-height:1.6}img,video{display:block;max-width:100%}
a{color:var(--ice);text-underline-offset:.24em}a:hover{color:var(--gold)}button,input,textarea,select{font:inherit}
:focus-visible{outline:3px solid var(--ice);outline-offset:4px}.skip{position:absolute;top:1rem;left:1rem;z-index:5;padding:.5rem 1rem;background:var(--bg);transform:translateY(-200%)}.skip:focus{transform:none}
.wrap{width:min(1120px,calc(100% - 3rem));margin-inline:auto}.masthead{background:#0a1320;border-bottom:1px solid #26374a}.mast-inner,.footer-inner{display:flex;align-items:center;justify-content:space-between;gap:1.2rem;min-height:70px}
.brand{color:var(--text);display:flex;align-items:center;gap:.65rem;text-decoration:none;font-weight:800;white-space:nowrap}.brand img{object-fit:contain}.brand strong{color:var(--gold);font-weight:800}
nav{display:flex;align-items:center;gap:clamp(.85rem,3vw,2rem)}nav a,footer a{color:var(--muted);font-size:.9rem;text-decoration:none;font-weight:600}
.hero{background:linear-gradient(90deg,#08111ef5 4%,#08111ea0 48%,#09132055 100%),linear-gradient(0deg,#07121fa0,transparent 45%),url('/brand/winter.jpg') center 58%/cover}
.hero-inner{display:grid;grid-template-columns:1.1fr .9fr;align-items:center;gap:3rem;min-height:clamp(470px,51vw,625px);padding-block:3.5rem}.hero-copy{max-width:37rem}
.eyebrow{color:var(--ice);font-weight:750;text-transform:uppercase;font-size:.875rem;letter-spacing:.15em;margin:0 0 .85rem}
h1,h2,h3{line-height:1.07;letter-spacing:-.045em;margin:0 0 .65em}h1{font-size:clamp(3.25rem,7.2vw,6.6rem);font-weight:850;margin-bottom:.25em}h1 em{color:var(--ice);font-style:normal}h2{font-size:clamp(2rem,4vw,3.1rem)}h3{font-size:1.4rem}
.intro{font-size:clamp(1.05rem,2vw,1.23rem);max-width:33ch;color:#deebf7;margin:0 0 1.8rem}.hero-logo{width:min(100%,385px);height:auto;justify-self:center;filter:drop-shadow(0 12px 22px #050b14b0)}
.button,button{background:var(--gold);border:1px solid transparent;color:#101b28;font-weight:800;padding:.65rem 1.07rem;border-radius:.4rem;cursor:pointer}.button{display:inline-block;text-decoration:none}.button:hover,button:hover{background:#ffd58d;color:#101b28}button:disabled{opacity:.6;cursor:wait}
.section{padding-block:clamp(3rem,6vw,5rem);scroll-margin-top:1rem}.platforms,.about{background:#101c2b;border-block:1px solid #213247}
.platform-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}.platform-grid article,.update,.panel,.empty{background:var(--panel);border:1px solid var(--line);border-radius:.75rem}
.platform-grid article{padding:1.45rem;background:#152337}.platform-grid svg{width:28px;height:28px;color:var(--gold);margin-bottom:.9rem}.platform-grid h3{margin-bottom:.35rem}.platform-grid p,.studio-intro,.developer p,.empty,.help{margin:0;color:var(--muted)}.studio-intro{max-width:58ch;font-size:1.15rem}
.developers{margin-top:clamp(2.5rem,5vw,4rem)}
.developer-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
.developer{overflow:hidden;border:1px solid var(--line);border-radius:.75rem;background:var(--panel)}
.developer img{width:100%;aspect-ratio:4/3;object-fit:cover;border-bottom:1px solid var(--line)}
.developer-copy{padding:clamp(1rem,3vw,1.6rem)}
.developer-copy h3{font-size:clamp(1.4rem,3vw,1.85rem);margin-bottom:.55rem}
.developer-copy p + p{margin-top:1rem}
.developer-copy strong{display:block;color:var(--ice)}
@media(max-width:620px){.developer-grid{grid-template-columns:1fr}}
.empty{padding:1.5rem}.update{margin-bottom:1rem;overflow:hidden}.update-content{padding:1.4rem}.meta{color:var(--ice);font-size:.875rem;margin:0 0 .55rem}.body-copy{white-space:pre-wrap;overflow-wrap:anywhere;color:#dce7f1;margin:0}
.media-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:.6rem;padding:0 1.4rem 1.4rem}.media-grid :is(img,video){border-radius:.35rem;width:100%;max-height:400px;object-fit:contain;background:#09131e}
footer{border-top:1px solid #26374a;color:var(--muted);font-size:.875rem}.page-title{font-size:clamp(2.55rem,6vw,4.2rem)}
.admin-head{display:flex;align-items:center;justify-content:space-between;gap:1rem}.workspace{display:grid;grid-template-columns:1fr 2fr;align-items:start;gap:1rem}.panel{padding:clamp(1rem,3vw,1.65rem)}.panel h2{font-size:1.45rem}
label{display:grid;gap:.32rem;margin-bottom:1rem;font-weight:650}input,textarea,select{width:100%;padding:.65rem .75rem;border:1px solid #435970;background:#0b1421;border-radius:.35rem;color:var(--text);min-width:0}textarea{resize:vertical}fieldset{border:1px solid var(--line);border-radius:.5rem;margin:0 0 1rem;padding:1rem;min-width:0}legend{padding:0 .3rem;font-weight:750}.help{margin-bottom:.75rem;font-size:.9rem}
#entries,#attachments{list-style:none;padding:0}#entries button,#attachments button{background:var(--soft);color:var(--text);border-color:var(--line);text-align:left}#entries button{width:100%;margin-bottom:.5rem;overflow-wrap:anywhere}#attachments li{display:flex;align-items:end;flex-wrap:wrap;gap:.55rem;margin-bottom:.75rem}#attachments label{flex:1 1 12rem;margin:0;overflow-wrap:anywhere}#status{color:var(--ice);margin-bottom:0}
@media(max-width:740px){.wrap{width:calc(100% - 2rem)}.hero-inner{gap:1.2rem;min-height:auto}.hero-logo{width:85%}.platform-grid{gap:.65rem}.platform-grid article{padding:1rem}}
@media(max-width:540px){.mast-inner{flex-wrap:wrap;gap:.6rem;padding-block:.65rem}.mast-inner nav{margin-left:auto}.brand img{width:34px;height:31px}.brand span{font-size:.875rem}.hero-inner{grid-template-columns:1fr;gap:2.25rem;padding-block:3rem}.hero-logo{width:min(70%,250px);justify-self:start}.platform-grid,.workspace{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
`;
