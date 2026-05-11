import React, { useState } from 'react';

const Controls = ({ onRun, onDijkstra }) => {
  const [params, setParams] = useState({
    num_ants: 10,
    alpha: 1.0,
    beta: 2.0,
    evaporation_rate: 0.5,
    iterations: 100,
  });

  const handleChange = (e) => {
    setParams({ ...params, [e.target.name]: parseFloat(e.target.value) });
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block">Number of Ants</label>
        <input
          type="range"
          name="num_ants"
          min="1"
          max="100"
          value={params.num_ants}
          onChange={handleChange}
          className="w-full"
        />
        <span>{params.num_ants}</span>
      </div>
      <div className="mb-4">
        <label className="block">Alpha (Pheromone Influence)</label>
        <input
          type="range"
          name="alpha"
          min="0.1"
          max="5.0"
          step="0.1"
          value={params.alpha}
          onChange={handleChange}
          className="w-full"
        />
        <span>{params.alpha}</span>
      </div>
      <div className="mb-4">
        <label className="block">Beta (Heuristic Influence)</label>
        <input
          type="range"
          name="beta"
          min="0.1"
          max="5.0"
          step="0.1"
          value={params.beta}
          onChange={handleChange}
          className="w-full"
        />
        <span>{params.beta}</span>
      </div>
      <div className="mb-4">
        <label className="block">Evaporation Rate</label>
        <input
          type="range"
          name="evaporation_rate"
          min="0.01"
          max="1.0"
          step="0.01"
          value={params.evaporation_rate}
          onChange={handleChange}
          className="w-full"
        />
        <span>{params.evaporation_rate}</span>
      </div>
      <div className="mb-4">
        <label className="block">Iterations</label>
        <input
          type="range"
          name="iterations"
          min="10"
          max="1000"
          step="10"
          value={params.iterations}
          onChange={handleChange}
          className="w-full"
        />
        <span>{params.iterations}</span>
      </div>
      <button
        onClick={() => onRun(params)}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
      >
        Run ACO
      </button>
      <button
        onClick={onDijkstra}
        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Run Dijkstra
      </button>
    </div>
  );
};

export default Controls;
