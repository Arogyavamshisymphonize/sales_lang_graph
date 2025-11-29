import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import Input from '../common/Input';
import Button from '../common/Button';
import OTPVerification from './OTPVerification';
import './Auth.css';

const Signup = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [showOTP, setShowOTP] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
        setServerError('');
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setServerError('');

        try {
            await signup(formData.email, formData.password, formData.fullName);
            setShowOTP(true);
        } catch (error) {
            setServerError(error.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (otp) => {
        setLoading(true);
        setServerError('');
        try {
            await authService.verifyEmail(formData.email, otp);
            // After verification, we can auto-login or redirect to login
            // For now, let's redirect to login with a success message or auto-login if possible
            // Since verifyEmail doesn't return a token, we might need to login again or just redirect
            navigate('/login', { state: { message: 'Account verified successfully! Please login.' } });
        } catch (error) {
            setServerError(error.message || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        // In a real app, we'd have a specific endpoint for resending OTP
        // For now, we can re-trigger signup or have a dedicated resend endpoint
        // Assuming re-triggering signup sends a new OTP if user exists but unverified
        try {
            await signup(formData.email, formData.password, formData.fullName);
        } catch (error) {
            setServerError(error.message || 'Failed to resend OTP.');
        }
    };

    const getPasswordStrength = () => {
        const password = formData.password;
        if (!password) return { strength: 0, label: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        return { strength, label: labels[Math.min(strength - 1, 4)] };
    };

    const passwordStrength = getPasswordStrength();

    if (showOTP) {
        return (
            <OTPVerification
                email={formData.email}
                onVerify={handleVerifyOTP}
                onResend={handleResendOTP}
                loading={loading}
                error={serverError}
            />
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card glass fade-in">
                <div className="auth-header">
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Get started with your AI Marketing Agent</p>
                </div>

                {serverError && (
                    <div className="alert alert-error">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <Input
                        label="Full Name"
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                    />

                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        error={errors.email}
                        required
                    />

                    <div>
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a strong password"
                            error={errors.password}
                            required
                        />
                        {formData.password && passwordStrength.strength > 0 && (
                            <div className="password-strength">
                                <div className="password-strength-bar">
                                    <div
                                        className={`password-strength-fill strength-${passwordStrength.strength}`}
                                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="password-strength-label">{passwordStrength.label}</span>
                            </div>
                        )}
                    </div>

                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        error={errors.confirmPassword}
                        required
                    />

                    <Button type="submit" variant="primary" fullWidth loading={loading}>
                        Create Account
                    </Button>

                    <div className="auth-divider">
                        <span>OR</span>
                    </div>

                    <a href="http://localhost:8000/api/auth/google/login" className="google-btn">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                        Sign up with Google
                    </a>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link-primary">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
