import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from './spinner/Spinner'

const RequiredAuth = () => {
    const { auth, loading } = useAuth();

    console.log(auth, "auth found")
    const location = useLocation();

    if (loading) {
        return (<Spinner />)
    }

    return auth ? (
        <Outlet />
    ) : (
        <Navigate to='/login' state={{ from: location }} replace />
    );
};
export default RequiredAuth;