import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signInWithGoogle } from "../../utilities/firebase"
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";

function Login() {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (user) navigate("/home");
    }, [user, loading]);

    return (
        <div>
            <button onClick={signInWithGoogle}>
                Sign in with Google
            </button>
        </div>
    );
};

export default Login;