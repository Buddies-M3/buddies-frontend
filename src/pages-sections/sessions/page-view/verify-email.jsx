"use client";

import { Fragment, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from '@mui/material';

import { useFormik } from "formik";
import * as yup from "yup"; // LOCAL CUSTOM COMPONENT

import BoxLink from "../box-link"; // GLOBAL CUSTOM COMPONENTS

import { H3 } from "components/Typography";
import { FlexRowCenter } from "components/flex-box";

import { getCookie, USER_TOKEN, UID } from "utils/cookies-utils";

const VerifyEmailPageView = ({email}) => {
  const router = useRouter();
  const [emailSent, setEmailSent] = useState(false);
  // FORM FIELD INITIAL VALUE
  const initialValues = {
    email: ""
  }; // FORM FIELD VALIDATION SCHEMA

  const validationSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("Email is required")
  });

  // Redirect to login if email is null
  useEffect(() => {
    if (email == null) {
      router.push('/login');
      return;
    }
  }, [email, router]);

  const handleResendEmail = async () => {
    const token = getCookie(USER_TOKEN);
    const formData = new FormData();
    formData.append("token", token);
    try {
      const response = await fetch('/api-keys/login/api/resend-verify-email', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setEmailSent(true);
          console.log("Email is sent");
        } else {
          console.log('Failed: ', data.message);
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
    onSubmit: values => {
      console.log(values);
    }
  });

  return (
    <Fragment>
      <H3 mb={3} textAlign="center">
        Verify your email
      </H3>

      {/* MESSAGE AREA */}
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <p>
          Please verify your email address. Check your email inbox (including the spam folder) and click the verification link sent to <strong>{decodeURIComponent(email)}</strong>.
        </p>

        {/* RESEND BUTTON */}
        <Button onClick={handleResendEmail} color="primary" variant="contained">
          Resend Email
        </Button>

        <Link component="button" variant="body2" onClick={handleLogin}>
      Login
    </Link>

        {emailSent && <p>A verification email has been resent. Please check your inbox.</p>}
      </Box>

      {/* BOTTOM LINK AREA */}
      {/* <FlexRowCenter mt={3} justifyContent="center" gap={1}>
        Don't have an account?
        <BoxLink title="Register" href="/register" />
      </FlexRowCenter> */}
    </Fragment>
  );
};

export default VerifyEmailPageView;