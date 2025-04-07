
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Update the document title
document.title = "CodePrism";

createRoot(document.getElementById("root")!).render(<App />);
