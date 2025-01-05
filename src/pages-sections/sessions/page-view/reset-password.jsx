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

      <Box onSubmit={handleSubmit} component="form" display="flex" flexDirection="column" gap={2}>
        {/* Conditionally render email field based on emailSent state */}
        {!emailSent && (
          <TextField fullWidth name="email" type="email" label="Email" onBlur={handleBlur} value={values.email} onChange={handleChange} helperText={touched.email && errors.email} error={Boolean(touched.email && errors.email)} />
        )}

        {/* Conditionally render reset button based on emailSent state */}
        {!emailSent && (
          <Button fullWidth type="submit" color="primary" variant="contained">
            Reset
          </Button>
        )}

        {/* Conditionally render success message based on emailSent state */}
        {emailSent && (
          <p>Password reset link has been sent to your email. Please check your inbox.</p>
        )}
      </Box>

      {!emailSent && <FlexRowCenter mt={3} justifyContent="center" gap={1}>
        Don&apos;t have an account?
        <BoxLink title="Register" href="/register" />
      </FlexRowCenter>}
      {emailSent &&  <Box textAlign="center" mb={2}><Link component="button" variant="body2" onClick={handleLogin} style={{textAlign: 'center'}}>Login</Link></Box>}
    </Fragment>
  );
};

export default ResetPassword;