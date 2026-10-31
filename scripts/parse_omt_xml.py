#!/usr/bin/env python3
"""
parse_omt_xml.py - Open Music Theory XML Ingestion Pipeline
Parses resources/OPEN-MUSIC-THEORY-1688414869.xml into structured Markdown files
with rich frontmatter, glossary terms, and media metadata.
"""

from __future__ import annotations
import os
import re
import sys
import json
import html
from pathlib import Path
import xml.etree.ElementTree as ET

# Ensure stdout handles unicode
sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = Path(__file__).resolve().parent.parent
XML_PATH = ROOT_DIR / "resources" / "OPEN-MUSIC-THEORY-1688414869.xml"
OUTPUT_THEORY_DIR = ROOT_DIR / "content" / "theory"
OUTPUT_GLOSSARY_PATH = ROOT_DIR / "content" / "glossary.json"

WP_NS = "{http://wordpress.org/export/1.2/}"
CONTENT_NS = "{http://purl.org/rss/1.0/modules/content/}"

def clean_html_text(text: str) -> str:
    """Unescape HTML entities and normalize whitespace."""
    if not text:
        return ""
    text = html.unescape(text)
    return text.strip()

def strip_tags(html_str: str) -> str:
    """Remove HTML tags from a string."""
    clean = re.sub(r'<[^>]+>', '', html_str)
    return clean_html_text(clean)

def extract_key_takeaways(content: str) -> tuple[list[str], str]:
    """
    Extracts key takeaways from <div class="textbox textbox--key-takeaways">
    and returns (takeaways_list, remaining_content).
    """
    takeaways = []
    pattern = r'<div class="textbox textbox--key-takeaways"[^>]*>(.*?)</div>\s*</div>'
    match = re.search(pattern, content, flags=re.DOTALL | re.IGNORECASE)
    
    if not match:
        # Fallback simpler match
        pattern = r'<div class="textbox textbox--key-takeaways"[^>]*>(.*?)</div>'
        match = re.search(pattern, content, flags=re.DOTALL | re.IGNORECASE)
        
    if match:
        block = match.group(1)
        # Find all li items
        li_items = re.findall(r'<li[^>]*>(.*?)</li>', block, flags=re.DOTALL | re.IGNORECASE)
        for li in li_items:
            clean_li = strip_tags(li)
            # Remove glossary shortcodes
            clean_li = re.sub(r'\[/?pb_glossary[^\]]*\]', '', clean_li)
            clean_li = re.sub(r'\s+', ' ', clean_li).strip()
            if clean_li:
                takeaways.append(clean_li)
        content = content[:match.start()] + content[match.end():]
        
    return takeaways, content

def convert_html_to_markdown(html_content: str, glossary_dict: dict) -> str:
    """Converts Pressbooks HTML content into clean Markdown."""
    if not html_content:
        return ""

    text = html_content

    # 1. Convert glossary shortcodes: [pb_glossary id="328"]notehead[/pb_glossary]
    def replace_glossary(match):
        gid = match.group(1)
        term = match.group(2)
        # Store term text
        return f"**{term}**"

    text = re.sub(r'\[pb_glossary\s+id=["\']?(\d+)["\']?\](.*?)\[/pb_glossary\]', replace_glossary, text)

    # 2. Convert caption shortcodes: [caption ...]<img ... /> Caption[/caption]
    def replace_caption(match):
        body = match.group(1)
        img_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*alt=["\']([^"\']*)["\'][^>]*>', body)
        if not img_match:
            img_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>', body)
            alt = ""
        else:
            alt = img_match.group(2)
        if img_match:
            src = img_match.group(1)
            caption_text = strip_tags(body[img_match.end():]).strip()
            if caption_text:
                return f"\n\n![{caption_text}]({src})\n*{caption_text}*\n\n"
            else:
                return f"\n\n![{alt}]({src})\n\n"
        return strip_tags(body)

    text = re.sub(r'\[caption[^\]]*\](.*?)\[/caption\]', replace_caption, text, flags=re.DOTALL)

    # 3. Convert standalone images: <img src="..." alt="..." />
    def replace_img(match):
        tag = match.group(0)
        src_match = re.search(r'src=["\']([^"\']+)["\']', tag)
        alt_match = re.search(r'alt=["\']([^"\']*)["\']', tag)
        src = src_match.group(1) if src_match else ""
        alt = alt_match.group(1) if alt_match else "Score Example"
        return f"\n\n![{alt}]({src})\n\n"

    text = re.sub(r'<img[^>]+>', replace_img, text)

    # 4. Convert audio: [audio mp3="..."][/audio] or <audio src="..."></audio>
    text = re.sub(r'\[audio\s+mp3=["\']([^"\']+)["\']\s*\]\[/audio\]', r'\n\n<audio controls src="\1"></audio>\n\n', text)
    text = re.sub(r'<audio[^>]+src=["\']([^"\']+)["\'][^>]*>.*?</audio>', r'\n\n<audio controls src="\1"></audio>\n\n', text, flags=re.DOTALL)

    # 5. Convert headings <h1> - <h6>
    for i in range(6, 0, -1):
        text = re.sub(rf'<h{i}[^>]*>(.*?)</h{i}>', lambda m: f"\n\n{'#' * i} {strip_tags(m.group(1))}\n\n", text, flags=re.DOTALL | re.IGNORECASE)

    # 6. Convert formatting tags
    text = re.sub(r'<(?:strong|b)[^>]*>(.*?)</(?:strong|b)>', r'**\1**', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<(?:em|i)[^>]*>(.*?)</(?:em|i)>', r'*\1*', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<code[^>]*>(.*?)</code>', r'`\1`', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<pre[^>]*>(.*?)</pre>', r'\n\n```\n\1\n```\n\n', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<blockquote[^>]*>(.*?)</blockquote>', lambda m: "\n" + "\n".join(f"> {line}" for line in strip_tags(m.group(1)).split("\n")) + "\n", text, flags=re.DOTALL | re.IGNORECASE)

    # 7. Convert links <a href="...">...</a>
    text = re.sub(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', r'[\2](\1)', text, flags=re.DOTALL | re.IGNORECASE)

    # 8. Convert list items <li>
    text = re.sub(r'<li[^>]*>(.*?)</li>', lambda m: f"\n- {strip_tags(m.group(1)).strip()}", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'</?[uo]l[^>]*>', '\n', text, flags=re.IGNORECASE)

    # 9. Convert paragraphs <p>
    text = re.sub(r'<p[^>]*>(.*?)</p>', lambda m: f"\n\n{m.group(1).strip()}\n\n", text, flags=re.DOTALL | re.IGNORECASE)

    # 10. Clean remaining tags (<br>, <div>, etc.)
    text = re.sub(r'<br\s*/?>', '\n', text, flags=re.IGNORECASE)
    text = re.sub(r'<hr\s*/?>', '\n\n---\n\n', text, flags=re.IGNORECASE)
    text = re.sub(r'<[^>]+>', '', text)

    # 11. Normalize entities & whitespace
    text = html.unescape(text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def parse_omt_xml(test_mode: bool = False):
    """Main parsing routine."""
    if not XML_PATH.exists():
        raise FileNotFoundError(f"Open Music Theory XML not found at {XML_PATH}")

    print(f"Loading Open Music Theory XML from: {XML_PATH}")
    tree = ET.parse(XML_PATH)
    root = tree.getroot()
    channel = root.find('channel')
    if channel is None:
        raise ValueError("Invalid RSS/Pressbooks XML: <channel> element missing.")

    print(f"Parsing channel: {channel.findtext('title')}")

    # 1. Parse Glossary
    glossary = {}
    items = channel.findall('item')
    for item in items:
        post_type = item.findtext(f"{WP_NS}post_type")
        if post_type == 'glossary':
            post_id = item.findtext(f"{WP_NS}post_id")
            title = clean_html_text(item.findtext('title'))
            content = clean_html_text(item.findtext(f"{CONTENT_NS}encoded"))
            clean_def = strip_tags(content) if content else ""
            if title:
                glossary[post_id] = {
                    "id": post_id,
                    "term": title,
                    "definition": clean_def
                }

    print(f"Extracted {len(glossary)} glossary terms.")
    OUTPUT_GLOSSARY_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_GLOSSARY_PATH, 'w', encoding='utf-8') as f:
        json.dump(glossary, f, indent=2, ensure_ascii=False)
    print(f"Saved glossary to {OUTPUT_GLOSSARY_PATH}")

    # 2. Parse Parts
    parts_by_id = {}
    for item in items:
        post_type = item.findtext(f"{WP_NS}post_type")
        if post_type == 'part':
            post_id = item.findtext(f"{WP_NS}post_id")
            title = clean_html_text(item.findtext('title'))
            post_name = item.findtext(f"{WP_NS}post_name")
            status = item.findtext(f"{WP_NS}status")
            menu_order_txt = item.findtext(f"{WP_NS}menu_order") or "0"
            try:
                menu_order = int(menu_order_txt)
            except ValueError:
                menu_order = 0

            # Filter out trashed/internal scrapyard parts unless testing
            if status == 'publish' and not post_name.endswith('__trashed') and post_name not in ['ideas', 'scrapyard', 'developer']:
                parts_by_id[post_id] = {
                    "id": post_id,
                    "title": title,
                    "slug": post_name,
                    "order": menu_order,
                    "status": status
                }

    print(f"Found {len(parts_by_id)} valid published parts.")

    # 3. Parse Chapters
    chapters_by_part = {pid: [] for pid in parts_by_id}
    orphan_chapters = []

    for item in items:
        post_type = item.findtext(f"{WP_NS}post_type")
        if post_type == 'chapter':
            post_id = item.findtext(f"{WP_NS}post_id")
            parent_id = item.findtext(f"{WP_NS}post_parent")
            status = item.findtext(f"{WP_NS}status")
            title = clean_html_text(item.findtext('title'))
            slug = item.findtext(f"{WP_NS}post_name")
            menu_order_txt = item.findtext(f"{WP_NS}menu_order") or "0"
            content = item.findtext(f"{CONTENT_NS}encoded") or ""
            try:
                menu_order = int(menu_order_txt)
            except ValueError:
                menu_order = 0

            if status == 'publish' and parent_id in parts_by_id:
                chapters_by_part[parent_id].append({
                    "id": post_id,
                    "parent_id": parent_id,
                    "title": title,
                    "slug": slug,
                    "order": menu_order,
                    "raw_content": content
                })
            elif status == 'publish':
                orphan_chapters.append(title)

    total_chapters = sum(len(chs) for chs in chapters_by_part.values())
    print(f"Found {total_chapters} published chapters across parts.")

    if test_mode:
        print("[TEST MODE] Validated XML structure successfully.")
        return

    # 4. Write Markdown Files
    OUTPUT_THEORY_DIR.mkdir(parents=True, exist_ok=True)
    generated_count = 0

    sorted_parts = sorted(parts_by_id.values(), key=lambda p: (p['order'], p['title']))
    
    # Map glossary terms for cross-referencing
    term_to_id = {v['term'].lower(): k for k, v in glossary.items() if v['term']}

    for part_idx, part in enumerate(sorted_parts, start=1):
        part_id = part['id']
        part_slug = part['slug']
        part_title = part['title']
        part_order = part['order']
        part_dir_name = f"part-{part_idx:02d}-{part_slug}"
        part_dir = OUTPUT_THEORY_DIR / part_dir_name
        part_dir.mkdir(parents=True, exist_ok=True)

        chs = sorted(chapters_by_part[part_id], key=lambda c: (c['order'], c['title']))

        for ch_idx, ch in enumerate(chs, start=1):
            raw = ch['raw_content']
            takeaways, body = extract_key_takeaways(raw)
            md_body = convert_html_to_markdown(body, glossary)

            # Detect referenced glossary terms
            referenced_terms = []
            lower_body = raw.lower()
            for term, gid in term_to_id.items():
                if len(term) > 3 and term in lower_body:
                    referenced_terms.append(term)
            referenced_terms = sorted(list(set(referenced_terms)))[:15]

            # Build YAML frontmatter
            yaml_lines = [
                "---",
                f'id: "{part_slug}.{ch["slug"]}"',
                f'title: "{ch["title"].replace(chr(34), chr(92) + chr(34))}"',
                f'part_id: "{part_slug}"',
                f'part_title: "{part_title.replace(chr(34), chr(92) + chr(34))}"',
                f'part_order: {part_order}',
                f'chapter_order: {ch["order"]}',
                f'slug: "{ch["slug"]}"',
            ]
            if takeaways:
                yaml_lines.append("key_takeaways:")
                for t in takeaways:
                    escaped_t = t.replace('"', '\\"')
                    yaml_lines.append(f'  - "{escaped_t}"')
            if referenced_terms:
                yaml_lines.append("glossary_terms:")
                for term in referenced_terms:
                    yaml_lines.append(f'  - "{term}"')
            yaml_lines.append("---\n")

            full_content = "\n".join(yaml_lines)
            if takeaways:
                full_content += "> [!TIP] Key Takeaways\n"
                for t in takeaways:
                    full_content += f"> - {t}\n"
                full_content += "\n"
            full_content += md_body + "\n"

            filename = f"ch-{ch_idx:02d}-{ch['slug']}.md"
            file_path = part_dir / filename
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(full_content)
            generated_count += 1

    print(f"Successfully generated {generated_count} Markdown chapter files in {OUTPUT_THEORY_DIR}")

if __name__ == "__main__":
    is_test = "--test" in sys.argv
    parse_omt_xml(test_mode=is_test)
