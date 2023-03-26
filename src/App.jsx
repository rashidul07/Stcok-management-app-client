import {
  createBrowserRouter, Outlet, RouterProvider
} from "react-router-dom";
import './App.css';
import Footer from './components/common/Footer';
import Navbar from './components/common/Navbar';
import AddProductPage from "./components/pages/AddProduct";
import AddUser from "./components/pages/AddUser";
import ErrorPage from './components/pages/Error';
import Home from './components/pages/Home';
import Login from './components/pages/Login';

const HeaderLayout = () => (
  <>
    <header>
      <Navbar />
    </header>
    <div className="main-container">
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
