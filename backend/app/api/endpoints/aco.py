from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict

from app.services.aco_service import ACOService
from app.models.graph import Graph

router = APIRouter()


# =========================
# Request Models
# =========================

class GraphData(BaseModel):
    nodes: List[Dict]
    edges: List[Dict]
    source: str
    destination: str


class ACOParams(BaseModel):
    num_ants: int
    alpha: float
    beta: float
    evaporation_rate: float
    iterations: int


class RunRequest(BaseModel):
    graph_data: GraphData
    params: ACOParams


# =========================
# Helper Function
# =========================

def build_aco_service(graph_data: GraphData, params: ACOParams) -> ACOService:
    """
    Create and configure a fresh ACOService instance.
    Prevents stale pheromone/state issues between requests.
    """

    graph = Graph(
        graph_data.nodes,
        graph_data.edges,
        graph_data.source,
        graph_data.destination
    )

    aco_service = ACOService()

    aco_service.set_graph(graph)

    aco_service.set_parameters(
        num_ants=params.num_ants,
        alpha=params.alpha,
        beta=params.beta,
        evaporation_rate=params.evaporation_rate,
        iterations=params.iterations
    )

    return aco_service


# =========================
# Routes
# =========================

@router.post("/run")
def run_aco(request: RunRequest):
    """
    Run full Ant Colony Optimization.
    """

    aco_service = build_aco_service(
        request.graph_data,
        request.params
    )

    result = aco_service.run()

    return result


@router.post("/run-iteration")
def run_iteration(request: RunRequest):
    """
    Run a single iteration of ACO.

    NOTE:
    This keeps the SAME input/output structure
    so frontend compatibility remains unchanged.
    """

    params = request.params.copy()

    # Force exactly ONE iteration
    params.iterations = 1

    aco_service = build_aco_service(
        request.graph_data,
        params
    )

    result = aco_service.run_iteration()

    return result


@router.post("/dijkstra")
def run_dijkstra(graph_data: GraphData):
    """
    Run Dijkstra shortest path algorithm.
    """

    graph = Graph(
        graph_data.nodes,
        graph_data.edges,
        graph_data.source,
        graph_data.destination
    )

    aco_service = ACOService()

    aco_service.set_graph(graph)

    shortest_path, shortest_distance = aco_service.dijkstra()

    return {
        "path": shortest_path,
        "distance": shortest_distance
    }