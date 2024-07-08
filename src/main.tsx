import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Header from './components/Header/Header';
import { ConfigProvider } from 'antd';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile';
import Footer from './components/Footer/Footer';
import Tables from './components/Tables/Tables';
import Product_detail from './components/Procudt_detail/Product_detail';
import ProductKind from './components/productKind/productKind';

function Root(){
  return(
    <ConfigProvider>
      <div className='page'>
      <Header />
      <Outlet/>
      <Footer></Footer>
      </div>
    </ConfigProvider>
  )
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    children:[
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/tables",
        element: <Tables />,
      },
      {
        path: "/productKind/:kind",
        element: <ProductKind/>,
      },
      {
        path: "/product_detail/:P_ID",
        element: <Product_detail />,
      }
    ]
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>,
)
