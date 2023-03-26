import { useEffect, useState } from "react";
import UseContext from "../../contexts/UseContext";
import Spinner from "../../Libs/Spinner";

const AddUser = () => {
    const { createUser, user, error, isLoading } = UseContext();
    const [singUpInfo, setSingUpInfo] = useState({ email: '', password: '', userName: '' });
    const [alert, setAlert] = useState({ message: '', className: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        createUser(singUpInfo.email, singUpInfo.password, singUpInfo.userName);
        setSingUpInfo({ email: '', password: '', userName: '' });
    }

    useEffect(() => {
        if (error) {
            setAlert({ message: error, className: 'bg-red-500' });
        }

    }, [error, user]);

    //redirect if user not admin
    useEffect(() => {
        if (user.email !== 'rashed@rmc.com') {
            window.location.pathname = '/';
        }
    }, [user]);

    return (
        <section className="bg-gray-50 dark:bg-gray-900 overflow-hidden w-full">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 h-full">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                            Add User
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User email</label>
                                <input
                                    onChange={(e) => setSingUpInfo({ ...singUpInfo, email: e.target.value })}
                                    value={singUpInfo.email}
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com"
                                    required="" />
                            </div>
                            <div>
                                <label htmlFor="Name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User Name</label>
                                <input
                                    onChange={(e) => setSingUpInfo({ ...singUpInfo, userName: e.target.value })}
                                    value={singUpInfo.userName}
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com"
                                    required="" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User Password</label>
                                <input
                                    onChange={(e) => setSingUpInfo({ ...singUpInfo, password: e.target.value })}
                                    value={singUpInfo.password}
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required="" />
                            </div>

                            {/* <Alert {...alert} /> */}
                            <button disabled={isLoading ? true : false} type="submit" className="w-full btn btn-primary">{isLoading ? <Spinner /> : "Create User"}</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AddUser;