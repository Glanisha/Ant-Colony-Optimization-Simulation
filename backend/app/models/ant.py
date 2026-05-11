import numpy as np
import random

class Ant:
    def __init__(self, start_node):
        self.current_node = start_node
        self.path = [start_node]
        self.path_distance = 0.0
        self.visited = {start_node}

    def move_to(self, node, distance):
        self.current_node = node
        self.path.append(node)
        self.path_distance += distance
        self.visited.add(node)

    def has_visited(self, node):
        return node in self.visited
