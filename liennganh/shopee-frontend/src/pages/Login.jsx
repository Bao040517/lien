import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { openAuthModal, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            openAuthModal('login');
        }
        navigate('/', { replace: true });
    }, [user, navigate, openAuthModal]);

    return null;
};

export default Login;
