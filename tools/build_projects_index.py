#!/usr/bin/env python3
"""Regenerate pages/projects/index.html from each page's meta.json.

A page is listed if its meta.json has "category": "Project Showcases".
Projects are ordered newest first by the year in their title
("Something - 2019"), falling back to the year they were posted.

Usage (from the repo root):  python3 tools/build_projects_index.py
"""
import html
import json
import os
import re

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "pages")
OUT = os.path.join(ROOT, "projects", "index.html")
CATEGORY = "Project Showcases"
EXCERPT_LEN = 180

PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Projects - Noorquacker Industries</title>
<link rel="stylesheet" href="../page.css">
</head>
<body>
<div class="page">
  <header class="banner">
    <p class="site">Noorquacker Industries</p>
    <h1 class="title">Projects</h1>
    <p class="meta"><span class="pill">{count} projects</span></p>
  </header>
  <main class="article">
    <p class="intro">Side projects I've worked on to an obsessive degree. Pick one to read the full write-up.</p>
    <div class="cards">
{cards}
    </div>
  </main>
  <footer class="footer">&copy; Noorquacker Industries</footer>
</div>
<script src="../page.js"></script>
</body>
</html>
"""

CARD = """      <a class="card" href="../{slug}/">
        {thumb}<span class="card-body">
          <span class="card-title">{title}</span>
          <span class="card-year">{year}</span>
          <span class="card-text">{excerpt}</span>
        </span>
      </a>"""


def article_body(page_html):
    m = re.search(r'<main class="article">(.*)</main>', page_html, re.S)
    return m.group(1) if m else page_html


def excerpt(body):
    for p in re.findall(r"<p>(.*?)</p>", body, re.S):
        text = html.unescape(re.sub(r"<[^>]+>", "", p)).strip()
        if len(text) > 40:
            if len(text) > EXCERPT_LEN:
                text = text[:EXCERPT_LEN].rsplit(" ", 1)[0] + "…"
            return text
    return ""


def main():
    projects = []
    for slug in sorted(os.listdir(ROOT)):
        meta_path = os.path.join(ROOT, slug, "meta.json")
        if not os.path.isfile(meta_path):
            continue
        meta = json.load(open(meta_path, encoding="utf-8"))
        if meta.get("category") != CATEGORY:
            continue
        body = article_body(open(os.path.join(ROOT, slug, "index.html"), encoding="utf-8").read())
        m = re.match(r"^(.*?)\s+-\s+(\d{4})$", meta["title"])
        title, year = (m.group(1), m.group(2)) if m else (meta["title"], meta["created"][:4])
        img = re.search(r'<img[^>]*src="(images/[^"]+)"', body)
        thumb = f'<img class="card-thumb" src="../{slug}/{img.group(1)}" alt="">\n        ' if img else ""
        projects.append((year, meta["created"], slug, title, thumb, excerpt(body)))

    projects.sort(key=lambda p: (p[0], p[1]), reverse=True)
    cards = "\n".join(
        CARD.format(slug=slug, title=html.escape(title), year=year, thumb=thumb, excerpt=html.escape(text))
        for year, _, slug, title, thumb, text in projects
    )
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(PAGE.format(count=len(projects), cards=cards))
    print(f"Wrote {OUT} with {len(projects)} projects")


if __name__ == "__main__":
    main()
