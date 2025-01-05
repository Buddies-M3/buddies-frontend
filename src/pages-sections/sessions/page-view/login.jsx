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



  return <form onSubmit={handleSubmit}>
    <BazaarTextField mb={1.5} fullWidth name="email" size="small" type="email" variant="outlined" onBlur={handleBlur} value={values.email} onChange={handleChange} label="Email" placeholder="exmple@mail.com" error={!!touched.email && !!errors.email} helperText={touched.email && errors.email} />

    <BazaarTextField mb={2} fullWidth size="small" name="password" label="Password" autoComplete="on" variant="outlined" onBlur={handleBlur} onChange={handleChange} value={values.password} placeholder="*********" type={visiblePassword ? "text" : "password"} error={!!touched.password && !!errors.password} helperText={touched.password && errors.password} InputProps={{
      endAdornment: <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
    }} />

    {wrongCredential && (
      <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>Wrong credentials</p>
    )}

    <Button fullWidth type="submit" color="primary" variant="contained" size="large">
      Login
    </Button>
  </form>;
};

export default LoginPageView;