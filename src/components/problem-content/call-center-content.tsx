
import React from 'react';

const CallCenterContent: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <div>
        <p className="text-muted-foreground">
          Design a call center system that can dispatch and manage calls to available agents.
          The system should efficiently handle call assignment and track when agents become available again.
        </p>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Methods</h3>
        <div className="space-y-4 text-muted-foreground">
          <div>
            <code className="text-sm">CallCenter(int k)</code>
            <p className="mt-1">
              Initializes object of the CallCenter class with k agents labeled from 1 to k.
              Initially, all agents are available.
            </p>
          </div>
          <div>
            <code className="text-sm">int dispatchCall()</code>
            <p className="mt-1">
              Assigns the call to an available agent with the smallest label. 
              Returns the label of the assigned agent. 
              If no agent is available, returns -1.
            </p>
          </div>
          <div>
            <code className="text-sm">void endCall(int agentLabel)</code>
            <p className="mt-1">
              Marks the agent with agentLabel as available. 
              If the agent is already available (not currently in a call), do nothing.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Example</h3>
        <pre className="bg-secondary p-4 rounded-md whitespace-pre-wrap break-words overflow-x-auto">
          <code>
{`// Initialize a call center with 2 agents
const center = new CallCenter(2);

center.dispatchCall();  // returns 1, agent 1 takes the call
center.dispatchCall();  // returns 2, agent 2 takes the call
center.dispatchCall();  // returns -1, no available agents
center.endCall(1);      // agent 1 becomes available
center.dispatchCall();  // returns 1, agent 1 takes a new call`}
          </code>
        </pre>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Constraints</h3>
        <ul className="space-y-2 text-muted-foreground list-disc pl-4">
          <li>0 ≤ k ≤ 1000</li>
          <li>At most 1000 calls will be made to dispatchCall and endCall.</li>
          <li>1 ≤ agentLabel ≤ k</li>
        </ul>
      </div>
    </div>
  );
};

export default CallCenterContent;
