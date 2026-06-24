from pydantic import BaseModel
from typing import List, Optional, Dict

class ResearcherNode(BaseModel):
    id: str
    name: str
    institution: str
    department: str
    degree_centrality: float
    betweenness_centrality: float
    h_index: int
    publication_count: int

class CollaborationEdge(BaseModel):
    source_id: str
    source_name: str
    target_id: str
    target_name: str
    shared_publications: int
    weight: float

class NetworkMetrics(BaseModel):
    researcher_id: str
    researcher_name: str
    degree: int
    degree_centrality: float
    betweenness_centrality: float
    eigenvector_centrality: float
    clustering_coefficient: float
    collaborator_count: int
    institution_reach: List[str]
    collaboration_gap: str

class NetworkCommunity(BaseModel):
    community_id: int
    label: str
    members: List[str]
    dominant_area: str
    size: int

class NetworkSummary(BaseModel):
    total_researchers: int
    total_edges: int
    network_density: float
    avg_degree: float
    most_connected: List[ResearcherNode]
    communities: List[NetworkCommunity]
    nodes: List[ResearcherNode]
    edges: List[CollaborationEdge]
