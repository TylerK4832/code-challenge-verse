
import React from 'react';

const FallbackContent: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <div>
        <p className="text-muted-foreground">
          Problem description is not available at this moment. Please try refreshing the page or contact support if the issue persists.
        </p>
      </div>
    </div>
  );
};

export default FallbackContent;
