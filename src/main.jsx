import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SerachStore from './pages/SerachStore.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Store from './pages/Store.jsx'
import StoresList from './pages/StoresList.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <SerachStore />
      },
      {
        path: '/store/:id',
        element: <Store />
      },
      {
        path: '/stores_list/:id_city',
        element: <StoresList />
      }
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
