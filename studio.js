// Creatively Grow studio: gallery admin.
// The password is kept in sessionStorage and sent as a header; every
// privileged call is checked server-side.
const API = '/api/studio';
let KEY = sessionStorage.getItem('cg_studio_key') || '';
let CURRENT = null;

const $ = (id) => document.getElementById(id);

async function api(action, { method = 'GET', body, query = '' } = {}) {
  const res = await fetch(`${API}?action=${action}${query}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Studio-Key': KEY },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) { logout(); throw new Error('unauthorized'); }
  return res.json();
}

function logout() {
  sessionStorage.removeItem('cg_studio_key');
  KEY = '';
  $('app').hidden = true;
  $('login').style.display = 'flex';
}

// ---------- auth ----------
async function tryLogin(pw) {
  KEY = pw;
  const res = await fetch(`${API}?action=check`, { headers: { 'X-Studio-Key': pw } });
  if (!res.ok) { KEY = ''; return false; }
  sessionStorage.setItem('cg_studio_key', pw);
  return true;
}

$('loginBtn').addEventListener('click', async () => {
  const pw = $('pw').value.trim();
  if (!pw) return;
  $('loginError').textContent = '';
  if (await tryLogin(pw)) { showApp(); }
  else { $('loginError').textContent = 'Wrong password.'; }
});
$('pw').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('loginBtn').click(); });

function showApp() {
  $('login').style.display = 'none';
  $('app').hidden = false;
  loadGalleries();
}

// ---------- galleries ----------
async function loadGalleries() {
  const { galleries } = await api('list');
  const list = $('galleryList');
  list.innerHTML = '';
  $('emptyMsg').hidden = galleries && galleries.length;
  (galleries || []).forEach((g) => {
    const row = document.createElement('button');
    row.className = 'st-row';
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(g.client_name)}</strong>
        <span>${g.title ? escapeHtml(g.title) + ' · ' : ''}${countLabel(g)}</span>
      </div>
      <span class="st-row-go">&rarr;</span>`;
    row.addEventListener('click', () => openGallery(g));
    list.appendChild(row);
  });
}

function openGallery(g) {
  CURRENT = g;
  $('listView').hidden = true;
  $('detailView').hidden = false;
  $('detailName').textContent = g.client_name;
  $('shareLink').value = `${location.origin}/g?c=${g.slug}`;
  $('uploads').innerHTML = '';
  loadVideos();
  loadPhotos();
}

$('backBtn').addEventListener('click', () => {
  $('detailView').hidden = true;
  $('listView').hidden = false;
  CURRENT = null;
  loadGalleries();
});

$('copyBtn').addEventListener('click', () => {
  $('shareLink').select();
  navigator.clipboard.writeText($('shareLink').value);
  $('copyBtn').textContent = 'Copied';
  setTimeout(() => ($('copyBtn').textContent = 'Copy'), 1600);
});

// Open the client link exactly as the client sees it.
$('previewBtn').addEventListener('click', () => {
  if (CURRENT) window.open(`/g?c=${encodeURIComponent(CURRENT.slug)}`, '_blank', 'noopener');
});

// ---------- new gallery ----------
$('newBtn').addEventListener('click', () => $('newModal').classList.add('is-open'));
$('newClose').addEventListener('click', () => $('newModal').classList.remove('is-open'));
$('newModal').addEventListener('click', (e) => { if (e.target === $('newModal')) $('newModal').classList.remove('is-open'); });

$('createBtn').addEventListener('click', async () => {
  const clientName = $('clientName').value.trim();
  if (!clientName) { $('createError').textContent = 'Client name is required.'; return; }
  $('createBtn').disabled = true;
  try {
    const { gallery, error } = await api('create', { method: 'POST', body: {
      clientName, title: $('galTitle').value.trim(), note: $('galNote').value.trim(),
    }});
    if (error) throw new Error(error);
    $('newModal').classList.remove('is-open');
    $('clientName').value = $('galTitle').value = $('galNote').value = '';
    openGallery({ ...gallery, videoCount: 0, photoCount: 0 });
  } catch (e) {
    $('createError').textContent = 'Could not create that gallery.';
  } finally {
    $('createBtn').disabled = false;
  }
});

// ---------- videos ----------
// The rendered order is the saved order, so the arrows only ever swap two
// neighbours and then write the whole list back as 0..n-1.
let VIDEOS = [];

async function loadVideos() {
  if (!CURRENT) return;
  const { videos, libraryId } = await api('videos', { query: `&galleryId=${CURRENT.id}` });
  VIDEOS = videos || [];
  renderVideos(libraryId);
}

function renderVideos(libraryId) {
  const wrap = $('videoList');
  wrap.innerHTML = '';
  VIDEOS.forEach((v, i) => {
    const card = document.createElement('div');
    card.className = 'st-video';
    // The poster is cache-busted on upload, so the iframe is left alone and
    // simply picks up whatever thumbnail Bunny is serving for this video.
    card.innerHTML = `
      <div class="st-video-frame">
        <iframe src="https://iframe.mediadelivery.net/embed/${libraryId}/${v.bunny_guid}?autoplay=false&preload=false"
          loading="lazy" allow="encrypted-media;picture-in-picture;fullscreen" allowfullscreen></iframe>
      </div>
      <div class="st-video-meta">
        <div class="st-move">
          <button class="st-move-btn" data-dir="-1" ${i === 0 ? 'disabled' : ''} title="Move up">&uarr;</button>
          <button class="st-move-btn" data-dir="1" ${i === VIDEOS.length - 1 ? 'disabled' : ''} title="Move down">&darr;</button>
        </div>
        <input class="st-title-input" type="text" value="${escapeHtml(v.title || '')}"
          placeholder="Untitled" maxlength="200">
        <label class="st-thumb-btn">Thumbnail<input type="file" accept="image/*" hidden></label>
        <button class="st-remove">Remove</button>
      </div>
      <p class="st-video-note"></p>`;

    const note = card.querySelector('.st-video-note');
    const say = (msg, bad) => {
      note.textContent = msg || '';
      note.classList.toggle('is-bad', Boolean(bad));
    };

    card.querySelectorAll('.st-move-btn').forEach((b) => {
      b.addEventListener('click', () => moveVideo(i, Number(b.dataset.dir), libraryId));
    });

    // Save on blur or Enter. Escape puts the old title back.
    const input = card.querySelector('.st-title-input');
    let saved = v.title || '';
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') input.blur();
      if (e.key === 'Escape') { input.value = saved; input.blur(); }
    });
    input.addEventListener('blur', async () => {
      const title = input.value.trim();
      if (title === saved) return;
      try {
        const r = await api('rename-video', { method: 'POST', body: { id: v.id, title } });
        if (r.error) throw new Error(r.error);
        saved = title;
        v.title = title;
        say('Saved');
        setTimeout(() => say(''), 1500);
      } catch (err) {
        console.error(err);
        input.value = saved;
        say('Could not rename that video.', true);
      }
    });

    card.querySelector('.st-thumb-btn input').addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      e.target.value = '';
      if (file) setThumbnail(v, file, say);
    });

    card.querySelector('.st-remove').addEventListener('click', async () => {
      if (!confirm('Remove this video from the gallery?')) return;
      await api('remove-video', { method: 'POST', body: { id: v.id } });
      loadVideos();
    });

    wrap.appendChild(card);
  });
}

async function moveVideo(index, dir, libraryId) {
  const to = index + dir;
  if (to < 0 || to >= VIDEOS.length) return;
  const before = VIDEOS.slice();
  [VIDEOS[index], VIDEOS[to]] = [VIDEOS[to], VIDEOS[index]];
  renderVideos(libraryId);
  try {
    const r = await api('reorder-videos', { method: 'POST', body: { ids: VIDEOS.map((v) => v.id) } });
    if (r.error) throw new Error(r.error);
  } catch (err) {
    // The client gallery reads the saved order, so a failed write must not
    // leave the studio showing an order that was never stored.
    console.error(err);
    VIDEOS = before;
    renderVideos(libraryId);
    alert('That order could not be saved. Try again.');
  }
}

// Upload the poster to the same storage the photos use, then hand Bunny the
// public URL. Bunny fetches it and serves it as the player thumbnail, so the
// client gallery needs no change.
async function setThumbnail(video, file, say) {
  say('Uploading thumbnail…');
  try {
    const init = await api('photo-upload-init', { method: 'POST', body: {
      filename: file.name, galleryId: CURRENT.id, kind: 'thumb',
    }});
    if (!init || !init.uploadUrl) throw new Error('init failed');

    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', init.uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300) ? resolve() : reject(new Error('upload ' + xhr.status));
      xhr.onerror = () => reject(new Error('network'));
      xhr.send(file);
    });

    const r = await api('set-thumbnail', { method: 'POST', body: {
      guid: video.bunny_guid, path: init.path,
    }});
    if (r.error) throw new Error(r.error);
    say('Thumbnail updated. It can take a minute to show everywhere.');
    setTimeout(() => say(''), 6000);
  } catch (err) {
    console.error(err);
    say('That thumbnail did not save.', true);
  }
}

// ---------- upload ----------
const dz = $('dropzone');
['dragenter', 'dragover'].forEach((ev) => dz.addEventListener(ev, (e) => {
  e.preventDefault(); dz.classList.add('is-over');
}));
['dragleave', 'drop'].forEach((ev) => dz.addEventListener(ev, (e) => {
  e.preventDefault(); dz.classList.remove('is-over');
}));
dz.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files));
$('fileInput').addEventListener('change', (e) => handleFiles(e.target.files));

function handleFiles(files) {
  [...files].forEach((f) => {
    if (f.type.startsWith('video/')) uploadOne(f);
    else if (f.type.startsWith('image/')) uploadPhoto(f);
  });
}

async function uploadPhoto(file) {
  const row = document.createElement('div');
  row.className = 'st-upload';
  row.innerHTML = `<span class="st-upload-name">${escapeHtml(file.name)}</span>
    <div class="st-bar"><div class="st-bar-fill"></div></div>
    <span class="st-upload-pct">0%</span>`;
  $('uploads').appendChild(row);
  const fill = row.querySelector('.st-bar-fill');
  const pct = row.querySelector('.st-upload-pct');

  try {
    const title = file.name.replace(/\.[^.]+$/, '');
    const init = await api('photo-upload-init', { method: 'POST', body: {
      filename: file.name, galleryId: CURRENT.id,
    }});
    if (!init || !init.uploadUrl) throw new Error('init failed');

    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', init.uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.upload.onprogress = (e) => {
        if (!e.lengthComputable) return;
        const p = Math.round((e.loaded / e.total) * 100);
        fill.style.width = p + '%';
        pct.textContent = p + '%';
      };
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300) ? resolve() : reject(new Error('upload ' + xhr.status));
      xhr.onerror = () => reject(new Error('network'));
      xhr.send(file);
    });

    await api('attach-photo', { method: 'POST', body: {
      galleryId: CURRENT.id, path: init.path, title, sortOrder: Date.now() % 100000,
    }});
    pct.textContent = 'Done';
    row.classList.add('is-done');
    setTimeout(() => { row.remove(); loadPhotos(); }, 1000);
  } catch (err) {
    console.error(err);
    pct.textContent = 'Failed';
    row.classList.add('is-failed');
  }
}

async function loadPhotos() {
  if (!CURRENT) return;
  const { photos, photoBase } = await api('photos', { query: `&galleryId=${CURRENT.id}` });
  const wrap = $('photoList');
  wrap.innerHTML = '';
  (photos || []).forEach((p) => {
    const card = document.createElement('div');
    card.className = 'st-photo';
    card.innerHTML = `
      <img src="${photoBase}${p.storage_path}" alt="${escapeHtml(p.title || '')}" loading="lazy">
      <button data-id="${p.id}" data-path="${p.storage_path}" class="st-photo-x" title="Remove">&times;</button>`;
    card.querySelector('.st-photo-x').addEventListener('click', async (e) => {
      if (!confirm('Remove this photo?')) return;
      await api('remove-photo', { method: 'POST', body: {
        id: e.target.dataset.id, path: e.target.dataset.path,
      }});
      loadPhotos();
    });
    wrap.appendChild(card);
  });
}

async function uploadOne(file) {
  const row = document.createElement('div');
  row.className = 'st-upload';
  row.innerHTML = `<span class="st-upload-name">${escapeHtml(file.name)}</span>
    <div class="st-bar"><div class="st-bar-fill"></div></div>
    <span class="st-upload-pct">0%</span>`;
  $('uploads').appendChild(row);
  const fill = row.querySelector('.st-bar-fill');
  const pct = row.querySelector('.st-upload-pct');

  try {
    const title = file.name.replace(/\.[^.]+$/, '');
    const auth = await api('upload-init', { method: 'POST', body: { title } });
    if (!auth || !auth.guid) throw new Error('init failed');

    await new Promise((resolve, reject) => {
      const upload = new tus.Upload(file, {
        endpoint: auth.endpoint,
        retryDelays: [0, 3000, 6000, 12000, 24000],
        headers: {
          AuthorizationSignature: auth.signature,
          AuthorizationExpire: String(auth.expiration),
          VideoId: auth.guid,
          LibraryId: String(auth.libraryId),
        },
        metadata: { filetype: file.type, title },
        onError: reject,
        onProgress: (sent, total) => {
          const p = Math.round((sent / total) * 100);
          fill.style.width = p + '%';
          pct.textContent = p + '%';
        },
        onSuccess: resolve,
      });
      upload.start();
    });

    await api('attach', { method: 'POST', body: {
      galleryId: CURRENT.id, guid: auth.guid, title,
    }});
    pct.textContent = 'Done';
    row.classList.add('is-done');
    setTimeout(() => { row.remove(); loadVideos(); }, 1200);
  } catch (err) {
    console.error(err);
    pct.textContent = 'Failed';
    row.classList.add('is-failed');
  }
}

function countLabel(g) {
  const parts = [];
  if (g.videoCount) parts.push(`${g.videoCount} video${g.videoCount === 1 ? '' : 's'}`);
  if (g.photoCount) parts.push(`${g.photoCount} photo${g.photoCount === 1 ? '' : 's'}`);
  return parts.length ? parts.join(' · ') : 'Empty';
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// ---------- tabs ----------
// The blog list is public data served from the blog zone; it needs no studio key.
function showTab(name) {
  document.querySelectorAll('.st-tab').forEach((t) => {
    t.classList.toggle('is-on', t.dataset.tab === name);
  });
  const blog = name === 'blog';
  $('blogView').hidden = !blog;
  $('listView').hidden = blog;
  // Leaving the blog tab should never strand the gallery detail view open.
  if (blog) $('detailView').hidden = true;
  else if (CURRENT) { $('listView').hidden = true; $('detailView').hidden = false; }
  if (blog) loadBlog();
}

document.querySelectorAll('.st-tab').forEach((t) => {
  t.addEventListener('click', () => showTab(t.dataset.tab));
});

async function loadBlog() {
  const list = $('blogList');
  const err = $('blogError');
  err.textContent = '';
  list.innerHTML = '<p class="st-empty">Loading…</p>';
  try {
    const res = await fetch('/blog/index.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { posts } = await res.json();
    list.innerHTML = '';
    $('blogEmpty').hidden = posts.length > 0;
    posts.forEach((p) => {
      const row = document.createElement('a');
      row.className = 'st-row';
      row.href = p.url;
      row.target = '_blank';
      row.rel = 'noopener';
      row.innerHTML = `
        <span>
          <strong>${escapeHtml(p.title)}</strong>
          <span>${escapeHtml(p.dateDisplay)}</span>
          ${p.targetKeyword ? `<span class="st-row-kw">${escapeHtml(p.targetKeyword)}</span>` : ''}
        </span>
        <span class="st-row-go">&rarr;</span>`;
      list.appendChild(row);
    });
  } catch (e) {
    list.innerHTML = '';
    $('blogEmpty').hidden = true;
    err.textContent = `Could not load posts (${e.message}).`;
  }
}

// ---------- boot ----------
(async () => {
  if (KEY && await tryLogin(KEY)) showApp();
  else $('login').style.display = 'flex';
})();
