import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language?: string;
}

const CodeEditor = ({ code, onChange, language = 'javascript' }: CodeEditorProps) => {
  return (
    <div className="h-full">
      <Editor
        height="100%"
        defaultLanguage={language}
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
  );
};

export default CodeEditor;