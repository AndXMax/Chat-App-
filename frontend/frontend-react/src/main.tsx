import { Provider } from "@/components/ui/provider"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom"
import ChatProvider from './Context/ChatProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode> 
    <Provider defaultTheme="light">
      <BrowserRouter>
        <ChatProvider>
          <App />
        </ChatProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
