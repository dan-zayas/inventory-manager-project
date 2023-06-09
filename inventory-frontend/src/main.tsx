import { createRoot } from 'react-dom/client';
import App from "./App"
import StoreProvider from './utils/store'

const container: HTMLElement | null = document.getElementById('app');
const root = createRoot(container!);
root.render(
    <StoreProvider>
        <App />
    </StoreProvider>
);