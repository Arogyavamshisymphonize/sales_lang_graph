import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import './Auth.css';

const OTPVerification = ({ email, onVerify, onResend, loading, error }) => {
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleResend = () => {
        setTimer(60);
        setCanResend(false);
        onResend();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onVerify(otp);
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass fade-in">
                <div className="auth-header">
                    <h1 className="auth-title">Verify Your Email</h1>
                    <p className="auth-subtitle">
                        We've sent a 6-digit code to <strong>{email}</strong>
                    </p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <Input
                        label="Enter OTP"
                        type="text"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        maxLength={6}
                        required
                        className="otp-input"
                    />

                    <Button type="submit" variant="primary" fullWidth loading={loading} disabled={otp.length !== 6}>
                        Verify Account
                    </Button>
                </form>

                <div className="auth-footer">
                    <p>
                        Didn't receive the code?{' '}
                        <button
                            type="button"
                            onClick={handleResend}
                            className={`text-button ${!canResend ? 'disabled' : ''}`}
                            disabled={!canResend}
                        >
                            {canResend ? 'Resend Code' : `Resend in ${timer}s`}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification;
