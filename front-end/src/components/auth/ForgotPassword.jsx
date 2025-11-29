import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import Input from '../common/Input';
import Button from '../common/Button';
import './Auth.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('Email is required');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email is invalid');
            return;
        }

        setLoading(true);

        try {
            await authService.forgotPassword(email);
            setSuccess(true);
            setTimeout(() => {
                // Navigate to reset password page with email in state
                navigate('/reset-password', { state: { email: email } });
            }, 2000);
        } catch (error) {
            setServerError(error.message || 'Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-container">
                <div className="auth-card glass fade-in">
                    <div className="auth-header">
                        <div className="success-icon">✓</div>
                        <h1 className="auth-title">Check Your Email</h1>
                        <p className="auth-subtitle">
                            If an account exists with this email, we've sent a 6-digit verification code to <strong>{email}</strong>
                        </p>
                    </div>

                    <div className="auth-footer">
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={() => navigate('/reset-password', { state: { email } })}
                        >
                            Enter Code
                        </Button>
                        <div style={{ marginTop: '1rem' }}>
                            <Link to="/login" className="auth-link">
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card glass fade-in">
                <div className="auth-header">
                    <h1 className="auth-title">Forgot Password?</h1>
                    <p className="auth-subtitle">
                        Enter your email address and we'll send you a link to reset your password
                    </p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                        }}
                        placeholder="you@example.com"
                        required
                    />

                    <Button type="submit" variant="primary" fullWidth loading={loading}>
                        Send Reset Link
                    </Button>
                </form>

                <div className="auth-footer">
                    <Link to="/login" className="auth-link">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
