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
    <div className="bg-[#0f172a] text-slate-100 p-6 rounded-2xl shadow-2xl border border-slate-700 w-full">
      <h2 className="text-2xl font-bold mb-6 text-cyan-300 tracking-wide">
        ACO Controls
      </h2>

      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <label className="text-slate-300 font-medium">
            Number of Ants
          </label>
          <span className="text-cyan-300 font-semibold">
            {params.num_ants}
          </span>
        </div>

        <input
          type="range"
          name="num_ants"
          min="1"
          max="100"
          value={params.num_ants}
          onChange={handleChange}
          className="w-full accent-cyan-400 cursor-pointer"
        />
      </div>

      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <label className="text-slate-300 font-medium">
            Alpha (Pheromone Influence)
          </label>
          <span className="text-cyan-300 font-semibold">
            {params.alpha}
          </span>
        </div>

        <input
          type="range"
          name="alpha"
          min="0.1"
          max="5.0"
          step="0.1"
          value={params.alpha}
          onChange={handleChange}
          className="w-full accent-cyan-400 cursor-pointer"
        />
      </div>

      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <label className="text-slate-300 font-medium">
            Beta (Heuristic Influence)
          </label>
          <span className="text-cyan-300 font-semibold">
            {params.beta}
          </span>
        </div>

        <input
          type="range"
          name="beta"
          min="0.1"
          max="5.0"
          step="0.1"
          value={params.beta}
          onChange={handleChange}
          className="w-full accent-cyan-400 cursor-pointer"
        />
      </div>

      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <label className="text-slate-300 font-medium">
            Evaporation Rate
          </label>
          <span className="text-cyan-300 font-semibold">
            {params.evaporation_rate}
          </span>
        </div>

        <input
          type="range"
          name="evaporation_rate"
          min="0.01"
          max="1.0"
          step="0.01"
          value={params.evaporation_rate}
          onChange={handleChange}
          className="w-full accent-cyan-400 cursor-pointer"
        />
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-slate-300 font-medium">
            Iterations
          </label>
          <span className="text-cyan-300 font-semibold">
            {params.iterations}
          </span>
        </div>

        <input
          type="range"
          name="iterations"
          min="10"
          max="1000"
          step="10"
          value={params.iterations}
          onChange={handleChange}
          className="w-full accent-cyan-400 cursor-pointer"
        />
      </div>

      <button
        onClick={() => onRun(params)}
        className="w-full bg-cyan-500 hover:bg-cyan-400 transition-all duration-200 text-slate-900 font-bold py-3 px-4 rounded-xl shadow-lg mb-3"
      >
        Run ACO
      </button>

      <button
        onClick={onDijkstra}
        className="w-full bg-slate-700 hover:bg-slate-600 transition-all duration-200 text-white font-bold py-3 px-4 rounded-xl shadow-lg border border-slate-500"
      >
        Run Dijkstra
      </button>
    </div>
  );
};

export default Controls;