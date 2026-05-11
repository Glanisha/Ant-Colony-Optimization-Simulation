import numpy as np
import heapq

class Graph:
    def __init__(self, nodes, edges, source, destination):
        self.nodes = {node['id']: node for node in nodes}
        self.edges = edges
        self.source = source
        self.destination = destination
        self.adj = {node_id: [] for node_id in self.nodes}
        self.node_indices = {node_id: i for i, node_id in enumerate(self.nodes)}
        self.num_nodes = len(self.nodes)
        self.distances = np.full((self.num_nodes, self.num_nodes), np.inf)
        
        for i in range(self.num_nodes):
            self.distances[i, i] = 0

        for edge in edges:
            u, v, weight = edge['source'], edge['target'], edge['weight']
            self.adj[u].append((v, weight))
            u_idx, v_idx = self.node_indices[u], self.node_indices[v]
            self.distances[u_idx, v_idx] = weight
            # For undirected graphs, uncomment the following line
            # self.distances[v_idx, u_idx] = weight
            # self.adj[v].append((u, weight))


    def get_distance(self, u, v):
        u_idx, v_idx = self.node_indices[u], self.node_indices[v]
        return self.distances[u_idx, v_idx]

    def dijkstra(self, start_node, end_node):
        distances = {node: float('inf') for node in self.nodes}
        distances[start_node] = 0
        previous_nodes = {node: None for node in self.nodes}
        priority_queue = [(0, start_node)]

        while priority_queue:
            current_distance, current_node = heapq.heappop(priority_queue)

            if current_distance > distances[current_node]:
                continue

            if current_node == end_node:
                break

            for neighbor, weight in self.adj.get(current_node, []):
                distance = current_distance + weight
                if distance < distances[neighbor]:
                    distances[neighbor] = distance
                    previous_nodes[neighbor] = current_node
                    heapq.heappush(priority_queue, (distance, neighbor))

        path, current_node = [], end_node
        while current_node is not None:
            path.insert(0, current_node)
            current_node = previous_nodes[current_node]
        
        if distances[end_node] == float('inf'):
            return [], float('inf')

        return path, distances[end_node]
