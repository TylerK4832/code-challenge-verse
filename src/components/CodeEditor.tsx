import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  lastSaved?: Date | null;
}

const CodeEditor = ({ code, onChange, lastSaved }: CodeEditorProps) => {
  return (
    <div className="h-full flex flex-col">
      {lastSaved && (
        <div className="px-4 py-2 text-sm text-muted-foreground flex items-center gap-2 border-b border-border">
          <Clock className="h-4 w-4" />
          <span>Restored from {format(lastSaved, 'MMM d, yyyy h:mm a')}</span>
        </div>
      )}
      <div className={`flex-1 ${lastSaved ? '' : 'h-full'}`}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={(value) => onChange(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;