// Client-facing share pages: a whole gallery (/s) or one video (/v).
//
// The server renders the <head> (so link previews get real OG tags) and drops
// the gallery data into the page as JSON. This file only renders it. It used to
// live inline in g.html and fetch its own data; the fetch is now a fallback for
// the case where the server could not preload.
(function () {
    const root = document.getElementById('gallery');
    const holder = document.getElementById('cg-data');
    const boot = holder ? JSON.parse(holder.textContent || '{}') : {};
    const slug = boot.slug || new URLSearchParams(location.search).get('c');
    const guid = boot.guid || new URLSearchParams(location.search).get('g');

    if (!slug) {
        root.innerHTML = '<p class="cg-g-msg">This link is missing its gallery code.</p>';
        return;
    }

    const esc = (s) => String(s || '').replace(/[&<>"']/g, (c) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    /** Strip characters that are illegal in filenames on Windows and macOS. */
    const safeName = (s, fallback) => (String(s || '').replace(/[\\/:*?"<>|]+/g, '-').trim() || fallback);

    /**
     * Pull the file down and hand the browser a real Save dialog with a proper
     * filename. A plain link cannot do this: the download attribute is ignored
     * cross-origin, so the browser would just open the file instead.
     * If the fetch is blocked, fall back to opening it so the client is never stuck.
     */
    async function saveFile(url, filename, onProgress) {
        const res = await fetch(url);
        if (!res.ok) throw new Error('http ' + res.status);

        let blob;
        if (res.body && window.ReadableStream) {
            const total = Number(res.headers.get('content-length')) || 0;
            const reader = res.body.getReader();
            const chunks = [];
            let got = 0;
            for (;;) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
                got += value.length;
                if (total && onProgress) onProgress(got / total);
            }
            blob = new Blob(chunks);
        } else {
            blob = await res.blob();
        }

        const href = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = href;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(href), 30000);
    }

    /**
     * Only used when the server could not preload the gallery. A stalled
     * connection is the one way this page could sit on "Loading…" forever, so
     * the request gets a hard deadline and always settles into data or an error.
     */
    async function loadGallery() {
        const ctl = new AbortController();
        const timer = setTimeout(() => ctl.abort(), 15000);
        const url = guid
            ? `/api/studio?action=video&slug=${encodeURIComponent(slug)}&guid=${encodeURIComponent(guid)}`
            : `/api/studio?action=view&slug=${encodeURIComponent(slug)}`;
        try {
            const res = await fetch(url, { signal: ctl.signal });
            if (res.status === 404) {
                const missing = new Error('not found');
                missing.notFound = true;
                throw missing;
            }
            if (!res.ok) throw new Error('http ' + res.status);
            return await res.json();
        } finally {
            clearTimeout(timer);
        }
    }

    /** Any ending that is not a gallery. Never leaves the page on "Loading…". */
    function showMessage(text, retry) {
        root.innerHTML = `
            <div class="cg-g-msg">
                <p>${esc(text)}</p>
                ${retry ? '<button class="cg-dl-all" id="cgRetry">Try again</button>' : ''}
            </div>`;
        const again = document.getElementById('cgRetry');
        if (again) again.addEventListener('click', start);
    }

    function render(g) {
        // A single-video link is titled by the film; a gallery by the project.
        const single = Boolean(guid);
        const only = (g.videos || [])[0];
        const heading = single
            ? ((only && only.title) || g.title || g.clientName)
            : (g.title || g.clientName);
        document.title = (g.clientName ? g.clientName + ' · ' : '') + 'Creatively Grow';

        const videos = (g.videos || []).map((v, i) => `
            <div class="cg-g-video">
                <div class="cg-g-frame">
                    <iframe src="https://iframe.mediadelivery.net/embed/${g.libraryId}/${v.bunny_guid}?autoplay=false&preload=false"
                        loading="lazy" allow="accelerometer;gyroscope;encrypted-media;picture-in-picture;fullscreen" allowfullscreen></iframe>
                </div>
                <div class="cg-g-row">
                    ${(v.title && !single) ? `<p class="cg-g-title">${esc(v.title)}</p>` : ''}
                    <button class="cg-dl" data-video="${esc(v.bunny_guid)}" data-i="${i}">Download</button>
                </div>
            </div>`).join('');

        const photos = (g.photos || []).map((p, i) => `
            <div class="cg-g-photo">
                <a href="${g.photoBase}${p.storage_path}" target="_blank" rel="noopener">
                    <img src="${g.photoBase}${p.storage_path}" alt="${esc(p.title || '')}" loading="lazy">
                </a>
                <button class="cg-dl" data-photo="${esc(p.storage_path)}" data-title="${esc(p.title || '')}" data-i="${i}">Download</button>
            </div>`).join('');

        const hasAny = Boolean(videos || photos);
        const count = (g.videos || []).length + (g.photos || []).length;

        root.innerHTML = `
            <div class="cg-g-hero">
                <img src="/assets/logo.png?v=5" alt="Creatively Grow">
                <h1>${esc(heading)}</h1>
                ${(g.note && !single) ? `<p>${esc(g.note)}</p>` : ''}
                ${hasAny && count > 1 ? `<button class="cg-dl-all" id="dlAll">Download everything</button>` : ''}
                <p class="cg-dl-note" id="dlNote"></p>
            </div>
            <div class="cg-g-wrap">
                ${videos}
                ${photos ? `<div class="cg-g-photos">${photos}</div>` : ''}
                ${hasAny ? '' : '<p class="cg-g-msg">Your files are being uploaded. Check back shortly.</p>'}
                ${single ? `<p class="cg-g-more"><a href="/s?c=${encodeURIComponent(slug)}">See everything in this gallery &rarr;</a></p>` : ''}
            </div>
            <div class="cg-g-foot">
                Made by <a href="https://creativelygrow.com">Creatively Grow</a> &middot; Tampa Bay
            </div>`;

        const note = document.getElementById('dlNote');
        const say = (msg) => { note.textContent = msg || ''; };

        // ---- one video ----
        async function grabVideo(btn) {
            const id = btn.dataset.video;
            const label = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Preparing…';
            try {
                const r = await fetch(`/api/studio?action=download&slug=${encodeURIComponent(slug)}&guid=${encodeURIComponent(id)}`);
                const info = await r.json();
                if (!r.ok) throw new Error(info.error || 'failed');
                await saveFile(info.url, info.filename, (frac) => {
                    btn.textContent = Math.round(frac * 100) + '%';
                });
                btn.textContent = 'Saved';
                setTimeout(() => { btn.textContent = label; btn.disabled = false; }, 2500);
            } catch (err) {
                console.error(err);
                if (String(err.message).includes('still encoding')) {
                    say('That film is still processing. Try again in a few minutes.');
                    btn.textContent = label;
                    btn.disabled = false;
                    return;
                }
                // Last resort: open it so the client can still save it manually.
                try {
                    const r = await fetch(`/api/studio?action=download&slug=${encodeURIComponent(slug)}&guid=${encodeURIComponent(id)}`);
                    const info = await r.json();
                    if (info.url) window.open(info.url, '_blank', 'noopener');
                } catch (_) { say('That download would not start. Reach out and we will send the file directly.'); }
                btn.textContent = label;
                btn.disabled = false;
            }
        }

        // ---- one photo ----
        async function grabPhoto(btn) {
            const path = btn.dataset.photo;
            const url = g.photoBase + path;
            const ext = (path.split('.').pop() || 'jpg').toLowerCase();
            const filename = safeName(btn.dataset.title, 'photo') + '.' + ext;
            const label = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Saving…';
            try {
                await saveFile(url, filename, (frac) => {
                    btn.textContent = Math.round(frac * 100) + '%';
                });
                btn.textContent = 'Saved';
                setTimeout(() => { btn.textContent = label; btn.disabled = false; }, 2000);
            } catch (err) {
                console.error(err);
                window.open(url, '_blank', 'noopener');
                btn.textContent = label;
                btn.disabled = false;
            }
        }

        root.querySelectorAll('[data-video]').forEach((b) =>
            b.addEventListener('click', () => grabVideo(b)));
        root.querySelectorAll('[data-photo]').forEach((b) =>
            b.addEventListener('click', () => grabPhoto(b)));

        // ---- everything, one at a time so the connection is not swamped ----
        const all = document.getElementById('dlAll');
        if (all) all.addEventListener('click', async () => {
            const items = [...root.querySelectorAll('[data-video], [data-photo]')];
            all.disabled = true;
            for (let i = 0; i < items.length; i++) {
                say(`Downloading ${i + 1} of ${items.length}…`);
                await (items[i].dataset.video ? grabVideo(items[i]) : grabPhoto(items[i]));
            }
            say('All done. Check your downloads folder.');
            all.disabled = false;
        });
    }

    async function start() {
        // The server already resolved this link and found nothing. Say so rather
        // than re-asking the API for a record that does not exist.
        if (boot.notFound) {
            showMessage('We couldn\'t find that link. Double-check it, '
                + 'or reach out and we\'ll send a fresh one.', false);
            return;
        }
        let g = boot.gallery;
        if (!g) {
            root.innerHTML = '<p class="cg-g-msg">Loading…</p>';
            try {
                g = await loadGallery();
            } catch (err) {
                console.error('gallery load failed', err);
                if (err.notFound) {
                    showMessage('We couldn\'t find that link. Double-check it, '
                        + 'or reach out and we\'ll send a fresh one.', false);
                } else if (err.name === 'AbortError') {
                    showMessage('That took too long to load. Check your connection '
                        + 'and try again.', true);
                } else {
                    showMessage('Your gallery didn\'t load. That one is on us, '
                        + 'give it another go.', true);
                }
                return;
            }
        }
        // Past this point the gallery exists, so a failure is a rendering bug.
        // It must not tell the client their link is bad.
        try {
            render(g);
        } catch (err) {
            console.error('gallery render failed', err);
            showMessage('Your gallery loaded but wouldn\'t display. Reach out and '
                + 'we\'ll send your files directly.', true);
        }
    }

    start();
})();
