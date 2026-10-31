#!/usr/bin/env python3
"""
query_graph.py - CLI tool to query the Music Theory & LilyPond Knowledge Graph
Usage:
  python scripts/query_graph.py inspect <node_id>
  python scripts/query_graph.py prerequisites <concept_id>
  python scripts/query_graph.py dependents <concept_id>
  python scripts/query_graph.py path <from_concept> <to_concept>
  python scripts/query_graph.py list-lessons
"""

from __future__ import annotations
import sys
import json
import sqlite3
from pathlib import Path
from collections import deque

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = Path(__file__).resolve().parent.parent
SQLITE_DB_PATH = ROOT_DIR / "content" / "knowledge-graph" / "knowledge.sqlite"
GRAPH_JSON_PATH = ROOT_DIR / "content" / "knowledge-graph" / "graph.json"

def get_connection():
    if not SQLITE_DB_PATH.exists():
        raise FileNotFoundError(f"Knowledge database not found at {SQLITE_DB_PATH}. Run scripts/build_knowledge_graph.py first.")
    return sqlite3.connect(SQLITE_DB_PATH)

def inspect_node(node_id: str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, type, title, data_json FROM nodes WHERE id = ?", (node_id,))
    row = cur.fetchone()
    if not row:
        print(f"Error: Node '{node_id}' not found.")
        return

    nid, ntype, title, data_json = row
    data = json.loads(data_json)
    print(f"\n=== Node: {title} ({nid}) ===")
    print(f"Type: {ntype}")
    for k, v in data.items():
        if k not in ["id", "title", "type"]:
            print(f"{k}: {v}")

    # Outgoing edges
    cur.execute("SELECT relation, target FROM edges WHERE source = ?", (node_id,))
    out_edges = cur.fetchall()
    if out_edges:
        print("\nOutgoing Connections:")
        for rel, tgt in out_edges:
            cur.execute("SELECT title FROM nodes WHERE id = ?", (tgt,))
            trow = cur.fetchone()
            ttitle = trow[0] if trow else tgt
            print(f"  --[{rel}]--> {ttitle} ({tgt})")

    # Incoming edges
    cur.execute("SELECT relation, source FROM edges WHERE target = ?", (node_id,))
    in_edges = cur.fetchall()
    if in_edges:
        print("\nIncoming Connections:")
        for rel, src in in_edges:
            cur.execute("SELECT title FROM nodes WHERE id = ?", (src,))
            srow = cur.fetchone()
            stitle = srow[0] if srow else src
            print(f"  <--[{rel}]-- {stitle} ({src})")
    conn.close()

def get_prerequisites(concept_id: str, direct_only: bool = False):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT title FROM nodes WHERE id = ?", (concept_id,))
    crow = cur.fetchone()
    if not crow:
        print(f"Error: Concept '{concept_id}' not found.")
        return
    print(f"\nPrerequisites for '{crow[0]}' ({concept_id}):")

    visited = set()
    queue = deque([concept_id])
    prereqs = []

    while queue:
        curr = queue.popleft()
        cur.execute("SELECT source FROM edges WHERE target = ? AND relation = 'PREREQUISITE_OF'", (curr,))
        parents = [r[0] for r in cur.fetchall()]
        for p in parents:
            if p not in visited:
                visited.add(p)
                cur.execute("SELECT title FROM nodes WHERE id = ?", (p,))
                title = cur.fetchone()[0]
                prereqs.append((p, title))
                if not direct_only:
                    queue.append(p)

    if not prereqs:
        print("  (None - this is a fundamental starting concept!)")
    else:
        for idx, (pid, title) in enumerate(prereqs, start=1):
            print(f"  {idx}. {title} ({pid})")
    conn.close()

def get_dependents(concept_id: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT title FROM nodes WHERE id = ?", (concept_id,))
    crow = cur.fetchone()
    if not crow:
        print(f"Error: Concept '{concept_id}' not found.")
        return
    print(f"\nConcepts that depend on '{crow[0]}' ({concept_id}):")

    cur.execute("SELECT target FROM edges WHERE source = ? AND relation = 'PREREQUISITE_OF'", (concept_id,))
    deps = cur.fetchall()
    if not deps:
        print("  (None - no concepts list this as a prerequisite)")
    else:
        for idx, (tgt,) in enumerate(deps, start=1):
            cur.execute("SELECT title FROM nodes WHERE id = ?", (tgt,))
            title = cur.fetchone()[0]
            print(f"  {idx}. {title} ({tgt})")
    conn.close()

def find_learning_path(start_id: str, target_id: str):
    conn = get_connection()
    cur = conn.cursor()

    # BFS from start to target
    queue = deque([[start_id]])
    visited = set([start_id])
    found_path = None

    while queue:
        path = queue.popleft()
        node = path[-1]
        if node == target_id:
            found_path = path
            break
        cur.execute("SELECT target FROM edges WHERE source = ? AND relation = 'PREREQUISITE_OF'", (node,))
        for (next_node,) in cur.fetchall():
            if next_node not in visited:
                visited.add(next_node)
                queue.append(path + [next_node])

    if found_path:
        print(f"\nCurriculum Learning Path from {start_id} to {target_id}:")
        for idx, nid in enumerate(found_path, start=1):
            cur.execute("SELECT title FROM nodes WHERE id = ?", (nid,))
            title = cur.fetchone()[0]
            print(f"  Step {idx}: {title} ({nid})")
    else:
        print(f"\nNo direct prerequisite chain found from {start_id} to {target_id}.")
    conn.close()

def list_lessons():
    if not GRAPH_JSON_PATH.exists():
        print("graph.json not found.")
        return
    with open(GRAPH_JSON_PATH, 'r', encoding='utf-8') as f:
        graph = json.load(f)
    curriculum = graph.get("curriculum", {})
    lessons = curriculum.get("lessons", [])
    print(f"\n=== {curriculum.get('title', 'Course Curriculum')} ({len(lessons)} Lessons) ===")
    for les in lessons:
        print(f"  Lesson {les['chapter_order']:02d}: {les['title']}")
        print(f"    - Concept: {les['concept_id']}")
        print(f"    - LilyPond Syntax: {les['syntax_id']}")
        if les.get("repertoire_id"):
            print(f"    - Repertoire Piece: {les['repertoire_id']}")

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return

    cmd = sys.argv[1].lower()
    if cmd == "inspect" and len(sys.argv) > 2:
        inspect_node(sys.argv[2])
    elif cmd == "prerequisites" and len(sys.argv) > 2:
        get_prerequisites(sys.argv[2])
    elif cmd == "dependents" and len(sys.argv) > 2:
        get_dependents(sys.argv[2])
    elif cmd == "path" and len(sys.argv) > 3:
        find_learning_path(sys.argv[2], sys.argv[3])
    elif cmd in ["list-lessons", "lessons"]:
        list_lessons()
    else:
        print(__doc__)

if __name__ == "__main__":
    main()
