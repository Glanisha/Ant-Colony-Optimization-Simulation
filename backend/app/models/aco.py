import numpy as np
import random
from .ant import Ant

class ACO:
    def __init__(self, graph, num_ants, alpha, beta, evaporation_rate, q=1.0):
        self.graph = graph
        self.num_ants = num_ants
        self.alpha = alpha  # Pheromone influence
        self.beta = beta    # Heuristic influence
        self.evaporation_rate = evaporation_rate
        self.q = q  # Pheromone deposit factor

        self.num_nodes = self.graph.num_nodes
        self.heuristic = self._calculate_heuristic()

    def reset(self):
        self.pheromones = np.ones((self.num_nodes, self.num_nodes))
        self.best_path = None
        self.best_distance = float('inf')

    def _calculate_heuristic(self):
        heuristic = np.zeros((self.num_nodes, self.num_nodes))
        for i in range(self.num_nodes):
            for j in range(self.num_nodes):
                if i != j and self.graph.distances[i, j] != np.inf:
                    heuristic[i, j] = 1.0 / self.graph.distances[i, j]
        return heuristic

    def run_iteration(self):
        ants = [Ant(self.graph.source) for _ in range(self.num_ants)]
        paths = []
        best_path = None
        best_distance = float('inf')

        for ant in ants:
            while ant.current_node != self.graph.destination:
                next_node = self._select_next_node(ant)
                if next_node is None:
                    # Ant is stuck, reset
                    ant.path = [self.graph.source]
                    ant.path_distance = 0.0
                    ant.visited = {self.graph.source}
                    ant.current_node = self.graph.source
                    break
                distance = self.graph.get_distance(ant.current_node, next_node)
                ant.move_to(next_node, distance)

            if ant.current_node == self.graph.destination:
                paths.append(list(ant.path))
                if ant.path_distance < best_distance:
                    best_path = list(ant.path)
                    best_distance = ant.path_distance

        self._update_pheromones(ants)
        return paths, self.pheromones.copy(), best_path, best_distance

    def _select_next_node(self, ant):
        current_node_idx = self.graph.node_indices[ant.current_node]
        
        neighbors = self.graph.adj.get(ant.current_node, [])
        unvisited_neighbors = [n for n, w in neighbors if n not in ant.visited]

        if not unvisited_neighbors:
            return None

        probabilities = []
        for neighbor in unvisited_neighbors:
            neighbor_idx = self.graph.node_indices[neighbor]
            
            pheromone = self.pheromones[current_node_idx, neighbor_idx] ** self.alpha
            heuristic = self.heuristic[current_node_idx, neighbor_idx] ** self.beta
            probabilities.append(pheromone * heuristic)

        total_prob = sum(probabilities)
        if total_prob == 0:
            # If all probabilities are zero, choose randomly
            return random.choice(unvisited_neighbors)

        probabilities = [p / total_prob for p in probabilities]
        
        # Roulette wheel selection
        r = random.random()
        cumulative_prob = 0
        for i, neighbor in enumerate(unvisited_neighbors):
            cumulative_prob += probabilities[i]
            if r <= cumulative_prob:
                return neighbor
        
        return unvisited_neighbors[-1] # Should not happen

    def _update_pheromones(self, ants):
        # Evaporation
        self.pheromones *= (1 - self.evaporation_rate)

        # Deposition
        for ant in ants:
            if ant.current_node == self.graph.destination:
                pheromone_deposit = self.q / ant.path_distance
                for i in range(len(ant.path) - 1):
                    u, v = ant.path[i], ant.path[i+1]
                    u_idx, v_idx = self.graph.node_indices[u], self.graph.node_indices[v]
                    self.pheromones[u_idx, v_idx] += pheromone_deposit
                    # For undirected graphs
                    # self.pheromones[v_idx, u_idx] += pheromone_deposit

    def get_best_path(self):
        return self.best_path, self.best_distance
