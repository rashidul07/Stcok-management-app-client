import {
  createBrowserRouter, Outlet, RouterProvider
} from "react-router-dom";
import './App.css';
import Footer from './components/common/Footer';
import Navbar from './components/common/Navbar';
import AddProductPage from "./components/pages/AddProduct";
import AddStock from "./components/pages/AddStock";
import AddUser from "./components/pages/AddUser";
import AllProducts from "./components/pages/AllProducts";
import ErrorPage from './components/pages/Error';
import Home from './components/pages/Home';
import Login from './components/pages/Login';

const HeaderLayout = () => (
  <>
    <header>
      <Navbar />
    </header>
    <div className="main-container justify-center">
      <Outlet />
    </div>
    < Footer />
  </>
);

const router = createBrowserRouter([
  {
    element: <HeaderLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/addProduct',
        element: <AddProductPage />,
      },
      {
        path: '/addStock',
        element: <AddStock />,
      },
      {
        path: '/shortlist',
        element: <AllProducts />,
      },
      {
        path: '/addUser',
        element: <AddUser />,
      },
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
]);

function App() {
  return (
    <div className='bg-white body'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
