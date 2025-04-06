import React from 'react';

const CallCenterContent: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <div>
        <p className="text-muted-foreground">
          Implement a call center system that manages incoming calls using a fixed pool of agents.
          Each agent is identified by a unique id starting from 1.
          When a call arrives, assign it to the available agent with the smallest id.
          If no agents are free, the call should be rejected.
        </p>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Methods</h3>
        <div className="space-y-4 text-muted-foreground">
          <div>
            <code className="text-sm">CallCenter(int numAgents)</code>
            <p className="mt-1">
              Initializes the call center with the given number of agents.
              Agents are assigned ids from 1 to numAgents.
            </p>
          </div>
          <div>
            <code className="text-sm">int dispatchCall()</code>
            <p className="mt-1">
              Dispatches an incoming call to the available agent with the smallest id.
              If an agent is available, mark the agent as busy and return their id.
              If no agents are available, return -1.
            </p>
          </div>
          <div>
            <code className="text-sm">void endCall(int agentId)</code>
            <p className="mt-1">
              Ends the call for the specified agent, marking them as available again.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Example</h3>
        <pre className="bg-secondary p-4 rounded-md whitespace-pre-wrap break-words overflow-x-auto">
          <code>
{`// Initialize call center with 2 agents
const callCenter = new CallCenter(2);

callCenter.dispatchCall(); // returns 1, assigns to agent 1
callCenter.dispatchCall(); // returns 2, assigns to agent 2
callCenter.dispatchCall(); // returns -1, no agents available

callCenter.endCall(1);     // ends call for agent 1
callCenter.dispatchCall(); // returns 1, agent 1 is now available`}
          </code>
        </pre>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Constraints</h3>
        <ul className="space-y-2 text-muted-foreground list-disc pl-4">
          <li>0 ≤ numAgents ≤ 1000</li>
          <li>At most 1000 calls to dispatchCall and endCall will be made.</li>
          <li>It is guaranteed that endCall will be called with a valid agent id that is currently busy.</li>
        </ul>
      </div>
    </div>
  );
};

export default CallCenterContent;
