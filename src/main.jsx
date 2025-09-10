import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SerachStore from './pages/SerachStore.jsx'
import StoresList from './pages/StoresList.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// NOVO: página de perfil (a que começa no BackgroundHeader.jsx)
import BackgroundHeader from './components/store/header/BackgroundHeader.jsx'
import { CartContextProvider } from './context/CartContext.jsx'
import Checkout from './pages/Checkout.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // usar "index" no filho raiz em vez de path:'/'
      { index: true, element: <SerachStore /> },

      // Rota nova (sugerida): /lojas/:storeId
      { path: 'lojas/:storeId', element: <BackgroundHeader /> },

      // Compatibilidade com a antiga: /store/:storeId
      // (aponta para a MESMA página de perfil)
      { path: 'store/:storeId', element: <BackgroundHeader /> },

      // Já existente
      { path: 'stores_list/:id_city', element: <StoresList /> },
      
      { path: 'checkout/:store_id', element: <Checkout /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartContextProvider>
      <RouterProvider router={router} />
    </CartContextProvider>
  </StrictMode>
)