"""
Research Collaboration Network Analysis Service — core AI logic.
Builds co-authorship graph and computes network metrics without external graph libraries.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from collections import defaultdict, Counter
from typing import Dict, List, Set, Tuple
from shared.data.rwanda_dataset import (
    RESEARCHERS, PUBLICATIONS,
    get_researcher_by_id, get_researcher_publications
)
from shared.utils.text_utils import classify_research_area
from researcher.network_analysis.models import (
    ResearcherNode, CollaborationEdge, NetworkMetrics,
    NetworkCommunity, NetworkSummary
)


def _build_graph() -> Tuple[Dict[str, Set[str]], Dict[Tuple[str, str], int]]:
    """Returns adjacency list and edge weights (shared publication count)."""
    adjacency: Dict[str, Set[str]] = defaultdict(set)
    edge_weights: Dict[Tuple[str, str], int] = defaultdict(int)

    for pub in PUBLICATIONS:
        authors = pub.get("authors", [])
        for i in range(len(authors)):
            for j in range(i + 1, len(authors)):
                a, b = authors[i], authors[j]
                key = (min(a, b), max(a, b))
                adjacency[a].add(b)
                adjacency[b].add(a)
                edge_weights[key] += 1

    return dict(adjacency), dict(edge_weights)


_ADJACENCY, _EDGE_WEIGHTS = _build_graph()
_ALL_IDS = [r["id"] for r in RESEARCHERS]


def _degree_centrality(rid: str) -> float:
    n = len(_ALL_IDS) - 1
    return len(_ADJACENCY.get(rid, set())) / n if n > 0 else 0.0


def _betweenness_centrality_approx(rid: str) -> float:
    """
    Approximate betweenness: fraction of all shortest paths that pass through this node.
    Uses BFS from each node (lightweight — no external lib needed).
    """
    count = 0
    total_paths = 0
    nodes = list(_ADJACENCY.keys())

    for source in nodes[:15]:  # Approximate with subset for performance
        if source == rid:
            continue
        # BFS
        visited = {source}
        queue = [(source, [source])]
        paths_through = 0
        total_source_paths = 0
        while queue:
            curr, path = queue.pop(0)
            for neighbor in _ADJACENCY.get(curr, set()):
                if neighbor not in visited:
                    visited.add(neighbor)
                    new_path = path + [neighbor]
                    queue.append((neighbor, new_path))
                    total_source_paths += 1
                    if rid in new_path[1:-1]:
                        paths_through += 1
        if total_source_paths > 0:
            count += paths_through / total_source_paths
            total_paths += 1

    return round(count / max(total_paths, 1), 4)


def _eigenvector_centrality_approx(rid: str) -> float:
    """Power iteration approximation (3 iterations)."""
    scores: Dict[str, float] = {r["id"]: 1.0 for r in RESEARCHERS}
    for _ in range(3):
        new_scores: Dict[str, float] = {}
        for node in scores:
            neighbors = _ADJACENCY.get(node, set())
            new_scores[node] = sum(scores.get(n, 0) for n in neighbors)
        total = sum(new_scores.values()) or 1
        scores = {k: v / total for k, v in new_scores.items()}
    max_val = max(scores.values()) or 1
    return round(scores.get(rid, 0) / max_val, 4)


def _clustering_coefficient(rid: str) -> float:
    neighbors = list(_ADJACENCY.get(rid, set()))
    k = len(neighbors)
    if k < 2:
        return 0.0
    edges_among = sum(
        1 for i in range(k) for j in range(i + 1, k)
        if neighbors[j] in _ADJACENCY.get(neighbors[i], set())
    )
    return round(2 * edges_among / (k * (k - 1)), 4)


def _primary_area(researcher_id: str) -> str:
    pubs = get_researcher_publications(researcher_id)
    areas = Counter(p.get("research_area", classify_research_area(p.get("abstract", ""))) for p in pubs)
    return areas.most_common(1)[0][0] if areas else "General Research"


def get_network_summary() -> NetworkSummary:
    nodes = []
    for r in RESEARCHERS:
        rid = r["id"]
        pubs = get_researcher_publications(rid)
        dc = round(_degree_centrality(rid), 4)
        bc = _betweenness_centrality_approx(rid)
        nodes.append(ResearcherNode(
            id=rid, name=r["name"],
            institution=r["institution"], department=r["department"],
            degree_centrality=dc,
            betweenness_centrality=bc,
            h_index=r.get("h_index", 0),
            publication_count=len(pubs),
        ))

    edges = []
    for (a, b), weight in _EDGE_WEIGHTS.items():
        ra = get_researcher_by_id(a)
        rb = get_researcher_by_id(b)
        if ra and rb:
            edges.append(CollaborationEdge(
                source_id=a, source_name=ra["name"],
                target_id=b, target_name=rb["name"],
                shared_publications=weight,
                weight=round(weight / 5.0, 2),
            ))

    connected_nodes = len(_ADJACENCY)
    total_possible = connected_nodes * (connected_nodes - 1) / 2 if connected_nodes > 1 else 1
    density = round(len(_EDGE_WEIGHTS) / total_possible, 4)
    degrees = [len(v) for v in _ADJACENCY.values()]
    avg_degree = round(sum(degrees) / len(degrees), 2) if degrees else 0.0

    most_connected = sorted(nodes, key=lambda x: x.degree_centrality, reverse=True)[:5]
    communities = _detect_communities()

    return NetworkSummary(
        total_researchers=len(RESEARCHERS),
        total_edges=len(_EDGE_WEIGHTS),
        network_density=density,
        avg_degree=avg_degree,
        most_connected=most_connected,
        communities=communities,
        nodes=nodes,
        edges=edges,
    )


def get_researcher_metrics(researcher_id: str) -> NetworkMetrics | None:
    researcher = get_researcher_by_id(researcher_id)
    if not researcher:
        return None

    neighbors = list(_ADJACENCY.get(researcher_id, set()))
    degree = len(neighbors)
    dc = round(_degree_centrality(researcher_id), 4)
    bc = _betweenness_centrality_approx(researcher_id)
    ec = _eigenvector_centrality_approx(researcher_id)
    cc = _clustering_coefficient(researcher_id)

    institutions = list(set(
        get_researcher_by_id(n)["institution"]
        for n in neighbors if get_researcher_by_id(n)
    ))

    # Collaboration gap: identify research areas not represented in collaborator network
    own_area = _primary_area(researcher_id)
    collab_areas = set(_primary_area(n) for n in neighbors)
    all_areas = {
        "Agriculture & Food Security","Health & Biomedical Sciences","ICT & Digital Innovation",
        "Environment & Natural Resources","Economics & Finance","Education & Social Sciences",
        "Energy & Infrastructure","Peace, Security & Governance"
    }
    gaps = all_areas - collab_areas - {own_area}
    gap_str = f"No collaborators in: {', '.join(list(gaps)[:3])}" if gaps else "Well-connected across disciplines"

    return NetworkMetrics(
        researcher_id=researcher_id,
        researcher_name=researcher["name"],
        degree=degree,
        degree_centrality=dc,
        betweenness_centrality=bc,
        eigenvector_centrality=ec,
        clustering_coefficient=cc,
        collaborator_count=degree,
        institution_reach=institutions,
        collaboration_gap=gap_str,
    )


def _detect_communities() -> List[NetworkCommunity]:
    """
    Simple greedy community detection by shared research area.
    In production, use Louvain or Girvan-Newman from networkx.
    """
    area_groups: Dict[str, List[str]] = defaultdict(list)
    for r in RESEARCHERS:
        area = _primary_area(r["id"])
        area_groups[area].append(r["name"])

    communities = []
    for idx, (area, members) in enumerate(sorted(area_groups.items())):
        communities.append(NetworkCommunity(
            community_id=idx,
            label=area.split("&")[0].strip(),
            members=members,
            dominant_area=area,
            size=len(members),
        ))
    return communities
