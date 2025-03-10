import React, { useState } from 'react';
import { Link } from "react-router-dom";
import UseContext from '../../contexts/UseContext';
const Navbar = () => {
    const [navbar, setNavbar] = useState(false);
    const { user, logOut } = UseContext();
    const handleLogOut = () => {
        logOut();
        //go to home page after logout
        window.location.pathname = '/';
    }
    // 
    return (
        <nav className="w-full shadow">
            <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
                <div>
                    <div className="flex items-center justify-between py-3 md:py-5 md:block">
                        <Link to="/" onClick={() => setNavbar(false)}>
                            <h2 className="text-2xl font-bold text-primary-focus">MRH DRUG HOUSE</h2>
                        </Link>
                        <div className="md:hidden">
                            <button
                                className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                                onClick={() => setNavbar(!navbar)}
                            >
                                {navbar ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <div
                        className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${navbar ? "block" : "hidden"
                            }`}
                    >
                        {
                            user?.email ? (
                                <ul className="items-center justify-center font-medium space-y-4 md:flex md:space-x-6 md:space-y-0" onClick={() => setNavbar(false)}>

                                    <li className="text-gray-600 hover:text-blue-600">
                                        <Link to="addProduct" >Add Products</Link>
                                    </li>
                                    {
                                        user?.email === 'romel@mrh.com' && (
                                            <>
                                                <li className="text-gray-600 hover:text-blue-600">
                                                    <Link to="shortProducts" >Products List</Link>
                                                </li>
                                                {/* <li className="text-gray-600 hover:text-blue-600">
                                                    <Link to="marketList" >Market List</Link>
                                                </li> */}
                                                <li className="text-gray-600 hover:text-blue-600">
                                                    <Link to="modifyProduct">Modify Product</Link>
                                                </li>
                                                <li className="text-gray-600 hover:text-blue-600">
                                                    <Link to="dashboard">Dashboard</Link>
                                                </li>
                                                <li className="text-gray-600 hover:text-blue-600">
                                                    <Link to="addUser">Add User</Link>
                                                </li>
                                            </>


                                        )
                                    }
                                    <li className="text-gray-600 hover:text-blue-600">
                                        <Link to="print">Print</Link>
                                    </li>
                                    {/* <li className="text-gray-600 hover:text-blue-600">
                                        <Link to="market">Market</Link>
                                    </li> */}
                                    <li className="text-gray-600 hover:text-blue-600" onClick={handleLogOut}>
                                        <Link href="/">Logout</Link>
                                    </li>
                                </ul>
                            ) : (
                                <ul className="items-center font-medium justify-center space-y-4 md:flex md:space-x-6 md:space-y-0">
                                    <li className="text-gray-600 hover:text-blue-600">
                                        <Link to="print">Print</Link>
                                    </li>
                                    {/* <li className="text-gray-600 hover:text-blue-600">
                                        <Link to="market">Market</Link>
                                    </li> */}
                                    <li className="text-gray-600 hover:text-blue-600" onClick={() => setNavbar(false)}>
                                        <Link to="login">Login</Link>
                                    </li>
                                </ul>
                            )
                        }
                    </div>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;