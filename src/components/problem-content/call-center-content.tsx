
import React from 'react';

const CallCenterContent: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <div>
        <p className="text-muted-foreground">
          Design a CallCenter class that can manage call dispatching with multiple agents. The system should efficiently 
          assign calls to available agents and handle call completion.
        </p>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Methods</h3>
        <div className="space-y-4 text-muted-foreground">
          <div>
            <code className="text-sm">CallCenter(int numAgents)</code>
            <p className="mt-1">
              Initializes the call center with numAgents agents. Agents are numbered from 1 to numAgents.
            </p>
          </div>
          <div>
            <code className="text-sm">int dispatchCall()</code>
            <p className="mt-1">
              Dispatches a call to the available agent with the smallest ID. If an agent is available, mark them as busy 
              and return their ID. If no agents are available, return -1.
            </p>
          </div>
          <div>
            <code className="text-sm">void endCall(int agentId)</code>
            <p className="mt-1">
              Mark the agent with agentId as available, indicating they have completed their call.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Example</h3>
        <pre className="bg-secondary p-4 rounded-md whitespace-pre-wrap break-words overflow-x-auto">
          <code>
{`// Initialize call center with 2 agents
CallCenter center = new CallCenter(2);
center.dispatchCall();  // returns 1 (agent 1 takes the call)
center.dispatchCall();  // returns 2 (agent 2 takes the call)
center.dispatchCall();  // returns -1 (no available agents)
center.endCall(1);      // agent 1 becomes available
center.dispatchCall();  // returns 1 (agent 1 takes another call)`}
          </code>
        </pre>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Constraints</h3>
        <ul className="space-y-2 text-muted-foreground list-disc pl-4">
          <li>0 ≤ numAgents ≤ 1000</li>
          <li>1 ≤ agentId ≤ numAgents</li>
          <li>At most 1000 calls will be made to the CallCenter methods</li>
        </ul>
      </div>
    </div>
  );
};

export default CallCenterContent;
