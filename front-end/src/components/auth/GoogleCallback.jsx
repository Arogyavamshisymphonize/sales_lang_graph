import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GoogleCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth(); // We might need a direct setAuth method, but let's see

    useEffect(() => {
        const token = searchParams.get('token');
        const userStr = searchParams.get('user');

        if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));

                // Store in localStorage
                localStorage.setItem('access_token', token);
                localStorage.setItem('user', JSON.stringify(user));

                // We should ideally update the AuthContext state here
                // But a hard reload or just navigating might work if AuthContext reads from localStorage on mount
                // Let's try navigating to chat directly
                // If AuthContext doesn't update, we might need to reload

                // Dispatch a storage event or custom event if needed, but simple navigation usually works if AuthProvider initializes from localStorage

                // Force a small delay to ensure storage is set
                setTimeout(() => {
                    window.location.href = '/chat'; // Force reload to ensure context picks up new user
                }, 100);

            } catch (error) {
                console.error('Failed to parse user data', error);
                navigate('/login?error=google_auth_failed');
            }
        } else {
            navigate('/login?error=google_auth_failed');
        }
    }, [searchParams, navigate]);

    return (
        <div className="auth-container">
            <div className="auth-card glass fade-in" style={{ textAlign: 'center' }}>
                <div className="loading-spinner"></div>
                <p>Completing Google Sign In...</p>
            </div>
        </div>
    );
};

export default GoogleCallback;
