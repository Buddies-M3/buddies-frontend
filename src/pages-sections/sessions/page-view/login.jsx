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
  }; // LOGIN FORM FIELD VALIDATION SCHEMA
  const router = useRouter();

  const validationSchema = yup.object().shape({
    password: yup.string().required("Password is required"),
    email: yup.string().email("invalid email").required("Email is required")
  });
  const handleLoginSubmit = async (values) => {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    try {
      const response = await fetch('/api-keys/login/api/login', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setCookie(USER_TOKEN, data.token, { expires: 180 });
          setCookie(UID, data.uid, { expires: 180 });
          setCookie(USER_LOCAL_ID, data.localId, { expires: 180 });
          console.log("Project is successfully connected");
          router.push('/');
        } else {
          console.log('Failed: ', data.message);
          setWrongCredential(true);
        }
      } else if (response.status == 401) {
        const data = await response.json();
        if (data.status === 'not_verified') {
          router.push(`/verify-email/${values.email}`);
        } else {
          console.error('Failed to send request:', response.statusText);
          setWrongCredential(true);
        }
      } else {
        //showToast("System creation failed", true);
        console.error('Failed to send request:', response.statusText);
        setWrongCredential(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleLoginSubmit
  });



  return <form onSubmit={(e) => e.preventDefault()}>
    <div style={{ textAlign: 'center', marginBottom: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
      <p style={{ color: '#666', margin: 0 }}>Login is temporarily disabled</p>
    </div>
    
    <BazaarTextField mb={1.5} fullWidth name="email" size="small" type="email" variant="outlined" disabled value="" label="Email" placeholder="exmple@mail.com" />

    <BazaarTextField mb={2} fullWidth size="small" name="password" label="Password" autoComplete="on" variant="outlined" disabled value="" placeholder="*********" type="password" />

    <Button fullWidth type="submit" color="primary" variant="contained" size="large" disabled style={{opacity: 0.5}}>
      Login (Disabled)
    </Button>
  </form>;
};

export default LoginPageView;