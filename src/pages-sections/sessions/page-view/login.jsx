"use client";

import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { Fragment, useState } from "react";

import { useRouter } from 'next/navigation';

import * as yup from "yup"; 

// LOCAL CUSTOM COMPONENTS

import EyeToggleButton from "../eye-toggle-button"; 

// LOCAL CUSTOM HOOK

import usePasswordVisible from "../use-password-visible"; 

// GLOBAL CUSTOM COMPONENTS

import BazaarTextField from "components/BazaarTextField";

import { setCookie, USER_TOKEN, UID , USER_LOCAL_ID } from "utils/cookies-utils";


const LoginPageView = () => {
  const [wrongCredential, setWrongCredential] = useState(false);
  const {
    visiblePassword,
    togglePasswordVisible
  } = usePasswordVisible(); 
  
  // LOGIN FORM FIELDS INITIAL VALUES
  const initialValues = {
    email: "",
    password: ""
  }; 
  
  const router = useRouter();

  const validationSchema = yup.object().shape({
    password: yup.string().required("Password is required"),
    email: yup.string().email("invalid email").required("Email is required")
  });
  
  // Hardcoded credentials
  const HARDCODED_EMAIL = "admin@nctr.sd";
  const HARDCODED_PASSWORD = "Nctr@2024#Admin!";
  
  const handleLoginSubmit = async (values, { setSubmitting }) => {
    try {
      setWrongCredential(false);
      
      // Check hardcoded credentials
      if (values.email === HARDCODED_EMAIL && values.password === HARDCODED_PASSWORD) {
        // Generate session tokens
        const sessionToken = Math.random().toString(36).substr(2) + Date.now().toString(36);
        const userUid = 'user_' + Math.random().toString(36).substr(2, 9);
        const localId = 'local_' + Math.random().toString(36).substr(2, 9);
        
        // Set authentication cookies (persistent - no expiration)
        setCookie(USER_TOKEN, sessionToken);
        setCookie(UID, userUid);
        setCookie(USER_LOCAL_ID, localId);
        
        console.log("Login successful");
        
        // Use window.location for reliable navigation
        window.location.href = '/dashboard';
      } else {
        console.log('Invalid credentials');
        setWrongCredential(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setWrongCredential(true);
    } finally {
      setSubmitting(false);
    }
  }

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleLoginSubmit
  });



  return <Fragment>
    {wrongCredential && (
      <div style={{ textAlign: 'center', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#ffebee', borderRadius: '8px', border: '1px solid #ffcdd2' }}>
        <p style={{ color: '#c62828', margin: 0, fontSize: '14px' }}>Invalid credentials. Please try again.</p>
      </div>
    )}
    
    <form onSubmit={handleSubmit}>
      <BazaarTextField 
        mb={1.5} 
        fullWidth 
        name="email" 
        size="small" 
        type="email" 
        variant="outlined" 
        onBlur={handleBlur}
        value={values.email}
        onChange={handleChange}
        label="Email" 
        placeholder="Enter your email"
        error={!!(touched.email && errors.email)}
        helperText={touched.email && errors.email}
      />

      <BazaarTextField 
        mb={2} 
        fullWidth 
        size="small" 
        name="password" 
        label="Password" 
        autoComplete="on" 
        variant="outlined" 
        onBlur={handleBlur}
        value={values.password}
        onChange={handleChange}
        placeholder="Enter your password" 
        type={visiblePassword ? "text" : "password"}
        error={!!(touched.password && errors.password)}
        helperText={touched.password && errors.password}
        InputProps={{
          endAdornment: (
            <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
          )
        }}
      />

      <Button 
        fullWidth 
        type="submit" 
        color="primary" 
        variant="contained" 
        size="large"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Login"}
      </Button>
    </form>
  </Fragment>;
};

export default LoginPageView;