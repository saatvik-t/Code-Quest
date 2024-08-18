import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { logout } from "../services/authService";
import Spinner from "./Spinner";

export const WelcomePage = () => {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const logoff = async () => {
        setLoading(true);
        try {
            await logout();
            setAuth({});
            navigate('/');
        } catch (error) {
            console.error('Error during logout ', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='min-h-screen flex flex-col'>
                <nav className='bg-gray-500 text-white p-4 flex justify-between items-center'>
                    <div className='flex space-x-4'>
                        <Link to='/profile' className='hover:underline'>
                            Profile
                        </Link>
                        <Link to='/problems' className='hover:underline'>
                            Problems
                        </Link>
                        <Link to='/submissions' className='hover:underline'>
                            Submissions
                        </Link>
                    </div>
                    <button
                        onClick={logoff}
                        disabled={loading}
                        className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded'
                    >
                        {loading ? 'Logging Out...' : 'Logout'}
                    </button>
                </nav>

                <main className='flex-grow p-8'>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <>
                            <h1 className='text-3xl font-bold'>
                                Welcome, {auth.user?.firstName}
                            </h1>
                            <p className='mt-2 text-lg'>You are logged in!</p>
                            <br />
                        </>
                    )}
                </main>
            </div>
        </>
    );
};
