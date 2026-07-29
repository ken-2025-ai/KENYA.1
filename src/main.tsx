import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerPushServiceWorker } from './lib/pushNotifications'

createRoot(document.getElementById("root")!).render(<App />);

registerPushServiceWorker();
