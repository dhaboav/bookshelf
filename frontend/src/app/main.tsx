import { createRoot } from 'react-dom/client';
import { AppProvider } from './providers';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(<AppProvider />);
