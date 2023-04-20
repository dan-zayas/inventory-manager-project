import { createRoot } from 'react-dom/client';
import App from "./App"

const container: HTMLElement | null = document.getElementById('app');
const root = createRoot(container!);
root.render(<App />);
