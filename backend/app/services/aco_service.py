import numpy as np
from app.models.aco import ACO
from app.models.graph import Graph
import heapq

class ACOService:
    def __init__(self):
        self.graph = None
        self.aco = None

    def set_graph(self, graph: Graph):
        self.graph = graph
        self.aco = ACO(
            graph=self.graph,
            num_ants=10,
            alpha=1.0,
            beta=1.0,
            evaporation_rate=0.5
        )

    def set_parameters(self, num_ants: int, alpha: float, beta: float, evaporation_rate: float, iterations: int):
        if self.aco:
            self.aco.num_ants = num_ants
            self.aco.alpha = alpha
            self.aco.beta = beta
            self.aco.evaporation_rate = evaporation_rate
            self.iterations = iterations

    def run(self):
        if not self.aco:
            return {"error": "ACO not initialized"}

        self.aco.reset()
        all_paths = []
        all_pheromones = []
        best_path = None
        best_distance = float('inf')

        for _ in range(self.iterations):
            paths, pheromones, iter_best_path, iter_best_distance = self.aco.run_iteration()
            all_paths.append(paths)
            all_pheromones.append(pheromones.tolist())
            if iter_best_path is not None and (best_path is None or iter_best_distance < best_distance):
                best_path = iter_best_path
                best_distance = iter_best_distance

        return {
            "all_paths": all_paths,
            "all_pheromones": all_pheromones,
            "best_path": best_path,
            "best_distance": best_distance
        }

    def run_iteration(self):
        if not self.aco:
            return {"error": "ACO not initialized"}

        paths, pheromones = self.aco.run_iteration()
        best_path, best_distance = self.aco.get_best_path()

        return {
            "paths": paths,
            "pheromones": pheromones.tolist(),
            "best_path": best_path,
            "best_distance": best_distance
        }

    def dijkstra(self):
        if not self.graph:
            return {"error": "Graph not initialized"}
        
        return self.graph.dijkstra(self.graph.source, self.graph.destination)

