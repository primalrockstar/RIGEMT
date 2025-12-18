import React from 'react';
import { PremiumLock } from './PremiumLock';

const scenarios = [
  { id: 1, title: 'Basic Assessment' },
  { id: 2, title: 'Cardiac Emergency' },
  { id: 3, title: 'Trauma Response' },
  { id: 4, title: 'Pediatric Care' },
  { id: 5, title: 'Respiratory Distress' },
  { id: 6, title: 'Multi-System Failure' },
  { id: 7, title: 'Advanced Trauma' },
  { id: 8, title: 'Critical Care' },
  { id: 9, title: 'Emergency Protocols' },
  { id: 10, title: 'Field Operations' },
];

export default function QuizSelection() {
  const handleStartScenario = (scenario: any) => {
    // Logic to start the scenario
    console.log('Starting scenario:', scenario.title);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Select a Scenario</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((scenario, index) => {
          const isFreeScenario = index < 5;
          return (
            <PremiumLock
              key={scenario.id}
              isLocked={!isFreeScenario}
              featureName="Advanced Scenarios"
            >
              <button
                onClick={() => handleStartScenario(scenario)}
                className="w-full bg-slate-800 p-4 rounded text-left border border-slate-700 hover:bg-slate-700 transition-colors"
              >
                <div className="flex justify-between">
                  <span className="font-bold">{scenario.title}</span>
                  {!isFreeScenario && <span className="text-xs text-gray-500 uppercase tracking-widest">PRO</span>}
                </div>
              </button>
            </PremiumLock>
          );
        })}
      </div>
    </div>
  );
}