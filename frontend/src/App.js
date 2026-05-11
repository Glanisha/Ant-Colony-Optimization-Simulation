import React, { useState } from 'react';

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';

import axios from 'axios';

import Graph from './components/Graph';
import Controls from './components/Controls';

import 'reactflow/dist/style.css';

const API_URL = 'http://localhost:8000/api/aco';


// ========================================
// Edge Weight Panel
// ========================================

function EdgeWeightsPanel({ edges, setEdges }) {

  const handleWeightChange = (id, value) => {

    setEdges((eds) =>
      eds.map((e) =>
        e.id === id
          ? {
              ...e,
              weight: Number(value),
              label: value,
            }
          : e
      )
    );
  };

  return (
    <div className="mb-4">

      <h2 className="font-bold mb-2">
        Edge Weights
      </h2>

      {edges.map((edge) => (

        <div
          key={edge.id}
          className="flex items-center mb-2"
        >

          <span className="mr-2 text-sm">
            {edge.source} → {edge.target}
          </span>

          <input
            type="number"
            min="1"
            value={edge.weight}
            onChange={(e) =>
              handleWeightChange(edge.id, e.target.value)
            }
            className="w-20 text-black rounded px-2 py-1"
          />

        </div>
      ))}
    </div>
  );
}


// ========================================
// Main App
// ========================================

function App() {

  // ========================================
  // Nodes
  // ========================================

  const [nodes, setNodes] = useState([
    {
      id: '1',
      type: 'input',
      data: { label: 'Start' },
      position: { x: 100, y: 100 },
    },
    {
      id: '2',
      data: { label: 'Node 2' },
      position: { x: 300, y: 100 },
    },
    {
      id: '3',
      data: { label: 'Node 3' },
      position: { x: 100, y: 300 },
    },
    {
      id: '4',
      type: 'output',
      data: { label: 'End' },
      position: { x: 300, y: 300 },
    },
  ]);


  // ========================================
  // Edges
  // ========================================

  const [edges, setEdges] = useState([
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      label: '10',
      weight: 10,
    },
    {
      id: 'e1-3',
      source: '1',
      target: '3',
      label: '15',
      weight: 15,
    },
    {
      id: 'e2-4',
      source: '2',
      target: '4',
      label: '20',
      weight: 20,
    },
    {
      id: 'e3-4',
      source: '3',
      target: '4',
      label: '5',
      weight: 5,
    },
  ]);


  // ========================================
  // Source/Destination
  // ========================================

  const [source, setSource] = useState('1');
  const [destination, setDestination] = useState('4');


  // ========================================
  // Results
  // ========================================

  const [simulationResult, setSimulationResult] =
    useState(null);

  const [dijkstraResult, setDijkstraResult] =
    useState(null);


  // ========================================
  // ReactFlow handlers
  // ========================================

  const onNodesChange = (changes) =>
    setNodes((nds) =>
      applyNodeChanges(changes, nds)
    );

  const onEdgesChange = (changes) =>
    setEdges((eds) =>
      applyEdgeChanges(changes, eds)
    );


  // ========================================
  // Connect Nodes
  // ========================================

  const onConnect = (params) => {

    const newEdge = {
      ...params,

      id: `e${params.source}-${params.target}`,

      label: '10',

      weight: 10,

      animated: false,
    };

    setEdges((eds) =>
      addEdge(newEdge, eds)
    );
  };


  // ========================================
  // Add Node
  // ========================================

  const addNewNode = () => {

    const id = `${nodes.length + 1}`;

    const newNode = {

      id,

      data: {
        label: `Node ${id}`,
      },

      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };


  // ========================================
  // Run ACO
  // ========================================

  const runSimulation = async (params) => {

    try {

      const requestData = {

        graph_data: {

          nodes: nodes.map((n) => ({
            id: n.id,
            ...n.data,
          })),

          edges: edges.map((e) => ({
            source: e.source,
            target: e.target,
            weight: e.weight,
          })),

          source,
          destination,
        },

        params,
      };

      const response = await axios.post(
        `${API_URL}/run`,
        requestData
      );

      setSimulationResult(response.data);

    } catch (error) {

      console.error(
        'Error running simulation:',
        error
      );
    }
  };


  // ========================================
  // Run Dijkstra
  // ========================================

  const runDijkstra = async () => {

    try {

      const graphData = {

        nodes: nodes.map((n) => ({
          id: n.id,
          ...n.data,
        })),

        edges: edges.map((e) => ({
          source: e.source,
          target: e.target,
          weight: e.weight,
        })),

        source,
        destination,
      };

      const response = await axios.post(
        `${API_URL}/dijkstra`,
        graphData
      );

      setDijkstraResult(response.data);

    } catch (error) {

      console.error(
        'Error running Dijkstra:',
        error
      );
    }
  };


  // ========================================
  // UI
  // ========================================

  return (

    <div className="flex h-screen bg-gray-900 text-white">

      {/* Sidebar */}

      <div className="w-1/4 p-4 bg-gray-800 overflow-y-auto">

        <h1 className="text-2xl font-bold mb-4">
          ACO Pathfinding
        </h1>


        {/* Add Node Button */}

        <button
          onClick={addNewNode}
          className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded mb-4"
        >
          Add Node
        </button>


        {/* Source */}

        <div className="mb-3">

          <label className="block mb-1">
            Source
          </label>

          <select
            value={source}
            onChange={(e) =>
              setSource(e.target.value)
            }
            className="w-full text-black p-2 rounded"
          >

            {nodes.map((n) => (

              <option key={n.id} value={n.id}>
                {n.id}
              </option>
            ))}

          </select>
        </div>


        {/* Destination */}

        <div className="mb-4">

          <label className="block mb-1">
            Destination
          </label>

          <select
            value={destination}
            onChange={(e) =>
              setDestination(e.target.value)
            }
            className="w-full text-black p-2 rounded"
          >

            {nodes.map((n) => (

              <option key={n.id} value={n.id}>
                {n.id}
              </option>
            ))}

          </select>
        </div>


        <Controls
          onRun={runSimulation}
          onDijkstra={runDijkstra}
        />


        <EdgeWeightsPanel
          edges={edges}
          setEdges={setEdges}
        />


        {/* Results */}

        {simulationResult && (

          <div className="mt-4">

            <h2 className="text-xl font-bold">
              ACO Result
            </h2>

            <p>
              Best Path:
              {' '}
              {simulationResult.best_path.join(' → ')}
            </p>

            <p>
              Distance:
              {' '}
              {simulationResult.best_distance}
            </p>

          </div>
        )}


        {dijkstraResult && (

          <div className="mt-4">

            <h2 className="text-xl font-bold">
              Dijkstra Result
            </h2>

            <p>
              Path:
              {' '}
              {dijkstraResult.path.join(' → ')}
            </p>

            <p>
              Distance:
              {' '}
              {dijkstraResult.distance}
            </p>

          </div>
        )}

      </div>


      {/* Graph */}

      <div className="w-3/4">

        <Graph
          nodes={nodes}
          edges={edges}

          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}

          onConnect={onConnect}

          simulationResult={simulationResult}
        />

      </div>

    </div>
  );
}

export default App;