import React, { useEffect, useState } from 'react';
import UseContext from '../../contexts/UseContext';
import Alert from '../../Libs/Alert';
import Spinner from '../../Libs/Spinner';
const Login = () => {
    const { login, user, isLoading, error } = UseContext();
    const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
    const [alert, setAlert] = useState({ message: '', className: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        login(loginInfo.email, loginInfo.password)
        setLoginInfo({ email: '', password: '' });
    }

    useEffect(() => {
        if (error) {
            setAlert({ message: error, className: 'bg-red-500' });
        }
        if (user.email) {
            setAlert({ message: 'Successfully logged in', className: 'bg-green-500' });
        }
    }, [error, user]);

    //redirect if user is logged in
    useEffect(() => {
        if (user.email) {
            window.location.pathname = '/';
        }
    }, [user]);

    return (
        <section className="bg-gray-50 dark:bg-gray-900 overflow-hidden w-full">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 h-full">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input
                                    onChange={(e) => setLoginInfo({ ...loginInfo, email: e.target.value })}
                                    value={loginInfo.email}
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com"
                                    required="" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input
                                    onChange={(e) => setLoginInfo({ ...loginInfo, password: e.target.value })}
                                    value={loginInfo.password}
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required="" />
                            </div>

                            <Alert {...alert} />
                            <button disabled={isLoading ? true : false} type="submit" className="w-full btn btn-primary">{isLoading ? <Spinner /> : "Sing in"}</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;