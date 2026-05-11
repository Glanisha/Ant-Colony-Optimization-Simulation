import React from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  Background,
} from 'reactflow';

import 'reactflow/dist/style.css';

const Graph = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  simulationResult,
}) => {

  // =========================
  // Pheromone Visualization
  // =========================

  const getPheromoneStyle = (edge) => {

    if (!simulationResult?.all_pheromones) {
      return {
        stroke: '#888',
        strokeWidth: 2,
      };
    }

    try {

      const pheromones =
        simulationResult.all_pheromones[
          simulationResult.all_pheromones.length - 1
        ];

      const sourceIndex = parseInt(edge.source) - 1;
      const targetIndex = parseInt(edge.target) - 1;

      const pheromoneLevel =
        pheromones?.[sourceIndex]?.[targetIndex] || 0.1;

      const intensity = Math.min(1, pheromoneLevel / 5);

      return {
        stroke: `rgba(255,0,0,${0.3 + intensity})`,
        strokeWidth: 2 + intensity * 6,
      };

    } catch {
      return {
        stroke: '#888',
        strokeWidth: 2,
      };
    }
  };

  // =========================
  // Highlight Best Path
  // =========================

  const bestPathEdges = [];

  if (simulationResult?.best_path) {

    for (let i = 0; i < simulationResult.best_path.length - 1; i++) {

      bestPathEdges.push(
        `${simulationResult.best_path[i]}-${simulationResult.best_path[i + 1]}`
      );
    }
  }

  // =========================
  // Styled Edges
  // =========================

  const styledEdges = edges.map((edge) => {

    const isBestPath =
      bestPathEdges.includes(`${edge.source}-${edge.target}`);

    return {
      ...edge,

      animated: isBestPath,

      style: {
        ...getPheromoneStyle(edge),

        stroke: isBestPath
          ? '#00ff88'
          : getPheromoneStyle(edge).stroke,

        strokeWidth: isBestPath
          ? 6
          : getPheromoneStyle(edge).strokeWidth,
      },

      labelStyle: {
        fill: 'white',
        fontSize: 14,
      },
    };
  });

  return (
    <ReactFlowProvider>

      <div style={{ width: '100%', height: '100%' }}>

        <ReactFlow

          nodes={nodes}
          edges={styledEdges}

          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}

          fitView
        >

          <Controls />
          <Background />

        </ReactFlow>

      </div>

    </ReactFlowProvider>
  );
};

export default Graph;