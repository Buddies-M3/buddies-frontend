"use client";

import { Fragment, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from '@mui/material';

import { useFormik } from "formik";
import { useRouter } from 'next/navigation';

import * as yup from "yup"; // LOCAL CUSTOM COMPONENT

import BoxLink from "../box-link"; // GLOBAL CUSTOM COMPONENTS

import { H3 } from "components/Typography";
import { FlexRowCenter } from "components/flex-box";

const ResetPassword = () => {
  const router = useRouter();

  const [emailSent, setEmailSent] = useState(false);
  // FORM FIELD INITIAL VALUE
  const initialValues = {
    email: ""
  }; // FORM FIELD VALIDATION SCHEMA

  const handleResetPassword = async (values) => {
    const formData = new FormData();
    formData.append("email", values.email);
    try {
      const response = await fetch('/api-keys/login/api/reset-password', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setEmailSent(true);
        } else {
          console.log('Failed: ', data.message);
        }
      } else if (response.status == 401){
        const data = await response.json();
        if (data.status === 'not_verified'){
          router.push(`/api-keys/verify-email/${values.email}`);
        } else {
          console.error('Failed to send request:', response.statusText);  
        }
      } else {
        //showToast("System creation failed", true);
        console.error('Failed to send request:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  }

  const validationSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("Email is required")
  });
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
    onSubmit: handleResetPassword
  });
  return (
    <Fragment>
      <H3 mb={3} textAlign="center">
        Reset your password
      </H3>

      <div style={{ textAlign: 'center', marginBottom: '2rem', padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeaa7' }}>
        <p style={{ color: '#856404', margin: 0, fontSize: '14px' }}>Password reset is currently disabled. Please contact support for assistance.</p>
      </div>

      <Box component="form" display="flex" flexDirection="column" gap={2} onSubmit={(e) => e.preventDefault()}>
        <TextField fullWidth name="email" type="email" label="Email" disabled value="" placeholder="Enter your email" />

        <Button fullWidth type="submit" color="primary" variant="contained" disabled style={{opacity: 0.5}}>
          Reset (Disabled)
        </Button>
      </Box>

      <FlexRowCenter mt={3} justifyContent="center" gap={1} style={{opacity: 0.5}}>
        Don&apos;t have an account?
        <span style={{color: '#666', textDecoration: 'none', cursor: 'not-allowed'}}>Register (Disabled)</span>
      </FlexRowCenter>

      <FlexRowCenter mt={2} justifyContent="center" gap={1} style={{opacity: 0.5}}>
        Remember your password?
        <span style={{color: '#666', textDecoration: 'none', cursor: 'not-allowed'}}>Login (Disabled)</span>
      </FlexRowCenter>
    </Fragment>
  );
};

export default ResetPassword;