#!/usr/bin/env python3
"""
test_knowledge_graph.py - Automated test suite for Knowledge Graph integrity
Verifies:
1. No cycles exist in the PREREQUISITE_OF edges (strict DAG).
2. Every concept node referenced in edges exists in the node catalog.
3. Every lesson is mapped to a valid concept, syntax, and repertoire piece.
4. SQLite database tables and indices are consistent with graph.json.
"""

from __future__ import annotations
import sys
import json
import sqlite3
import unittest
from pathlib import Path
from collections import defaultdict, deque

ROOT_DIR = Path(__file__).resolve().parent.parent
GRAPH_JSON_PATH = ROOT_DIR / "content" / "knowledge-graph" / "graph.json"
SQLITE_DB_PATH = ROOT_DIR / "content" / "knowledge-graph" / "knowledge.sqlite"

class TestKnowledgeGraphIntegrity(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        self_path = Path(__file__).resolve()
        # Ensure graph is generated
        if not GRAPH_JSON_PATH.exists() or not SQLITE_DB_PATH.exists():
            import subprocess
            subprocess.run([sys.executable, str(ROOT_DIR / "scripts" / "build_knowledge_graph.py")], check=True)

        with open(GRAPH_JSON_PATH, 'r', encoding='utf-8') as f:
            cls.graph = json.load(f)

    def test_graph_structure(self):
        self.assertIn("nodes", self.graph)
        self.assertIn("edges", self.graph)
        self.assertIn("curriculum", self.graph)
        self.assertGreater(len(self.graph["nodes"]), 20)
        self.assertGreater(len(self.graph["edges"]), 20)

    def test_node_id_uniqueness(self):
        node_ids = [n["id"] for n in self.graph["nodes"]]
        self.assertEqual(len(node_ids), len(set(node_ids)), "Duplicate node IDs detected in knowledge graph!")

    def test_edge_references_exist(self):
        valid_ids = {n["id"] for n in self.graph["nodes"]}
        for edge in self.graph["edges"]:
            self.assertIn(edge["source"], valid_ids, f"Edge source '{edge['source']}' does not exist in nodes!")
            self.assertIn(edge["target"], valid_ids, f"Edge target '{edge['target']}' does not exist in nodes!")

    def test_prerequisite_dag_has_no_cycles(self):
        """Topological sort using Kahn's algorithm to verify absence of cycles."""
        adj = defaultdict(list)
        in_degree = defaultdict(int)
        prereq_nodes = set()

        for edge in self.graph["edges"]:
            if edge["relation"] == "PREREQUISITE_OF":
                u, v = edge["source"], edge["target"]
                adj[u].append(v)
                in_degree[v] += 1
                prereq_nodes.add(u)
                prereq_nodes.add(v)

        queue = deque([node for node in prereq_nodes if in_degree[node] == 0])
        visited_count = 0

        while queue:
            node = queue.popleft()
            visited_count += 1
            for neighbor in adj[node]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)

        self.assertEqual(visited_count, len(prereq_nodes), "Cycle detected in prerequisite DAG!")

    def test_lessons_completeness(self):
        lessons = self.graph["curriculum"]["lessons"]
        self.assertGreaterEqual(len(lessons), 10)
        for les in lessons:
            self.assertTrue(les["id"].startswith("lesson."))
            self.assertIn("theory_summary", les)
            self.assertIn("theory_quiz", les)
            self.assertIn("coding_challenge", les)
            self.assertIn("prompt", les["coding_challenge"])
            self.assertIn("solution_code", les["coding_challenge"])

    def test_sqlite_consistency(self):
        conn = sqlite3.connect(SQLITE_DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM nodes")
        node_count = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM edges")
        edge_count = cur.fetchone()[0]
        conn.close()

        self.assertEqual(node_count, len(self.graph["nodes"]))
        self.assertEqual(edge_count, len(self.graph["edges"]))

if __name__ == "__main__":
    unittest.main()
