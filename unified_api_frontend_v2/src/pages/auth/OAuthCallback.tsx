import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function OAuthCallback() {
    const [, setLocation] = useLocation();
    const { login } = useAuth();

    useEffect(() => {
        const handleOAuthCallback = () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');
            const userStr = params.get('user');
            const error = params.get('error');

            if (error) {
                toast.error(error || 'OAuth authentication failed');
                setLocation('/auth/login');
                return;
            }

            if (token && userStr) {
                try {
                    const user = JSON.parse(decodeURIComponent(userStr));
                    // Update auth context and storage
                    login(user, token);
                    toast.success('Login successful!');
                    setLocation('/dashboard');
                } catch (e) {
                    console.error('Failed to parse user data', e);
                    toast.error('Authentication failed: Invalid user data');
                    setLocation('/auth/login');
                }
            } else {
                toast.error('No token or user data received');
                setLocation('/auth/login');
            }
        };

        handleOAuthCallback();
    }, [setLocation, login]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Completing authentication...</p>
            </div>
        </div>
    );
}
