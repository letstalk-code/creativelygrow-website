#!/usr/bin/env python3
"""Render delivery/*.md into branded print PDFs via headless Chrome.
Markdown converter is hand-rolled — deliberately scoped to the subset these
docs actually use (headers, bold/italic, tables, lists incl. checkboxes,
blockquotes, hr, links, inline code) rather than pulling a dependency."""
import re, subprocess, sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DELIVERY = os.path.join(ROOT, "delivery")
OUT = os.path.join(DELIVERY, "_pdf", "out")
os.makedirs(OUT, exist_ok=True)

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

DOCS = [
    ("00-RUNBOOK.md", "00", "The Runbook", "Signed to live, phase by phase"),
    ("01-intake.md", "01", "Intake", "The gate — nothing starts without it"),
    ("01b-seo-audit.md", "01B", "SEO Audit", "What's leaking, before we build anything"),
    ("02-video-treatment.md", "02", "Video Treatment", "Brief, shot list, call sheet, deliverables"),
    ("03-ad-creative.md", "03", "Ad Creative", "Angle bank, two video cuts, one static"),
    ("04-landing-page.md", "04", "Landing Page", "Structure, form, build steps"),
    ("06-traffic.md", "06", "Traffic", "The channel rule, structure, lead scoring"),
    ("07-reporting.md", "07", "Reporting", "The six measures, baseline to Day 90"),
]

def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

# Color-emoji glyphs (⭐📱✅⏳) render via the system emoji font, not Inter/Oswald —
# clashes with the ink/cream/orange palette. Swap for brand-styled markers instead.
# Placeholders contain no markdown-special or HTML-special chars, so they survive
# esc()/inline() untouched and get resolved after md_to_html produces the final string.
EMOJI_SUB = {
    "⭐": "@@STAR@@",
    "📱": "@@VERT@@",
    "✅": "@@DONE@@",
    "⏳": "@@WIP@@",
}
EMOJI_HTML = {
    "@@STAR@@": '<span class="mk-star">&#9679;</span>',
    "@@VERT@@": '<span class="mk-vert">Vert</span>',
    "@@DONE@@": '<span class="mk-done">&#10003;</span>',
    "@@WIP@@": '<span class="mk-wip">in progress</span>',
}

LABEL_RE = re.compile(r'^\*\*[^*\n]+:\*\*\s*$')

def inline(t):
    t = esc(t)
    t = re.sub(r'`([^`]+)`', r'<code>\1</code>', t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<em>\1</em>', t)
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', t)
    return t

def md_to_html(md):
    lines = md.split("\n")
    out, i, n = [], 0, len(lines)
    in_table = False

    def close_lists():
        while out and out[-1] in ("</ul-open>",):
            pass

    list_stack = []

    def close_list():
        if list_stack:
            out.append(f"</{list_stack.pop()}>")

    while i < n:
        line = lines[i]

        # tables
        if re.match(r'^\s*\|', line) and i + 1 < n and re.match(r'^\s*\|[\s:-]+\|', lines[i+1]):
            close_list()
            headers = [c.strip() for c in line.strip().strip("|").split("|")]
            out.append('<div class="tbl-wrap"><table><thead><tr>' +
                        "".join(f"<th>{inline(h)}</th>" for h in headers) +
                        "</tr></thead><tbody>")
            i += 2
            while i < n and re.match(r'^\s*\|', lines[i]):
                cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                out.append("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in cells) + "</tr>")
                i += 1
            out.append("</tbody></table></div>")
            continue

        # fenced code block
        if line.strip().startswith("```"):
            close_list()
            i += 1
            buf = []
            while i < n and not lines[i].strip().startswith("```"):
                buf.append(esc(lines[i])); i += 1
            i += 1
            out.append(f'<pre><code>{chr(10).join(buf)}</code></pre>')
            continue

        # blockquote — join raw lines BEFORE inline(), so em/strong spans that
        # wrap across two source lines (common in these docs) still match.
        # A bare `>` with nothing after it is a print placeholder, not prose —
        # render it as an actual line to write on, one per bare `>` line.
        if line.strip().startswith(">"):
            close_list()
            raw = []
            while i < n and lines[i].strip().startswith(">"):
                raw.append(re.sub(r'^\s*>\s?', '', lines[i]))
                i += 1
            joined = " ".join(raw).strip()
            if joined:
                out.append(f'<blockquote>{inline(joined)}</blockquote>')
            else:
                out.append('<div class="fill-lines">'
                            + ('<span class="fill-line"></span>' * max(1, len(raw)))
                            + '</div>')
            continue

        # headers
        m = re.match(r'^(#{1,4})\s+(.*)', line)
        if m:
            close_list()
            level = len(m.group(1))
            out.append(f'<h{level}>{inline(m.group(2))}</h{level}>')
            i += 1
            continue

        # hr
        if re.match(r'^\s*---+\s*$', line):
            close_list()
            out.append('<hr>')
            i += 1
            continue

        # checkbox list item
        m = re.match(r'^(\s*)-\s+\[([ xX])\]\s+(.*)', line)
        if m:
            if not list_stack or list_stack[-1] != "ul":
                close_list(); out.append('<ul class="check">'); list_stack.append("ul")
            checked = m.group(2).lower() == "x"
            out.append(f'<li class="{"done" if checked else ""}"><span class="box"></span>{inline(m.group(3))}</li>')
            i += 1
            continue

        # ordered list item
        m = re.match(r'^(\s*)(\d+)\.\s+(.*)', line)
        if m:
            if not list_stack or list_stack[-1] != "ol":
                close_list(); out.append('<ol>'); list_stack.append("ol")
            out.append(f'<li>{inline(m.group(3))}</li>')
            i += 1
            continue

        # unordered list item
        m = re.match(r'^(\s*)-\s+(.*)', line)
        if m:
            if not list_stack or list_stack[-1] != "ul":
                close_list(); out.append('<ul>'); list_stack.append("ul")
            out.append(f'<li>{inline(m.group(2))}</li>')
            i += 1
            continue

        # blank
        if not line.strip():
            close_list()
            i += 1
            continue

        # paragraph — a standalone "**Label:**" line (the fillable fields in the
        # brief / call sheet) is its own line, never merged with a neighbour.
        close_list()
        is_label = LABEL_RE.match(line.strip())
        buf = [line]
        i += 1
        if not is_label:
            while (i < n and lines[i].strip()
                   and not re.match(r'^(\s*)([-\d#>]|```|\s*\|)', lines[i])
                   and not LABEL_RE.match(lines[i].strip())):
                buf.append(lines[i]); i += 1
        out.append(f'<p>{inline(" ".join(buf))}</p>')
        # A field label with nothing structured right after it (blank, another
        # label, or end of section) is a blank to write on, not a heading —
        # give it a line. One that leads into a list/table/paragraph doesn't.
        if is_label:
            nxt = lines[i].strip() if i < n else ""
            if not nxt or LABEL_RE.match(nxt) or nxt == ">":
                out.append('<div class="fill-lines"><span class="fill-line"></span></div>')

    close_list()
    return "\n".join(out)

TEMPLATE = open(os.path.join(DELIVERY, "_pdf", "template.html")).read()

for fname, num, title, sub in DOCS:
    path = os.path.join(DELIVERY, fname)
    if not os.path.exists(path):
        print(f"skip (missing): {fname}"); continue
    md = open(path).read()
    # drop the H1 title line — the cover page renders it
    md = re.sub(r'^#\s+.*\n', '', md, count=1)
    for ch, ph in EMOJI_SUB.items():
        md = md.replace(ch, ph)
    body_html = md_to_html(md)
    for ph, html in EMOJI_HTML.items():
        body_html = body_html.replace(ph, html)
    html = (TEMPLATE
            .replace("{{DOC_NUM}}", num)
            .replace("{{DOC_TITLE}}", esc(title))
            .replace("{{DOC_SUB}}", esc(sub))
            .replace("{{BODY}}", body_html))
    html_path = os.path.join(OUT, fname.replace(".md", ".html"))
    pdf_path = os.path.join(OUT, fname.replace(".md", ".pdf"))
    open(html_path, "w").write(html)
    r = subprocess.run([CHROME, "--headless", "--disable-gpu", "--no-pdf-header-footer",
                         f"--print-to-pdf={pdf_path}", f"file://{html_path}"],
                        capture_output=True, text=True)
    ok = os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 1000
    print(f"{'OK ' if ok else 'FAIL'} {fname} -> {os.path.basename(pdf_path)}"
          f" ({os.path.getsize(pdf_path) if ok else 0} bytes)")
