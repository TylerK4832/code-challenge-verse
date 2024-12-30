import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
}

const CodeEditor = ({ code, onChange, language }: CodeEditorProps) => {
  // Map language names to Monaco editor language IDs
  const getMonacoLanguage = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'python':
        return 'python';
      case 'javascript':
      default:
        return 'javascript';
    }
  };

  return (
    <div className="h-full">
      <Editor
        height="100%"
        defaultLanguage={getMonacoLanguage(language)}
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