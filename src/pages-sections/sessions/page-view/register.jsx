"use client";

import { Fragment, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useFormik } from "formik";
import * as yup from "yup"; // LOCAL CUSTOM COMPONENTS

import EyeToggleButton from "../eye-toggle-button"; // LOCAL CUSTOM HOOK

import BoxLink from "../box-link";
import usePasswordVisible from "../use-password-visible"; // GLOBAL CUSTOM COMPONENTS

import { Span } from "components/Typography";
import { FlexBox } from "components/flex-box";
import BazaarTextField from "components/BazaarTextField";

import { setCookie, USER_TOKEN, UID, USER_LOCAL_ID } from "utils/cookies-utils";

import { useRouter } from 'next/navigation';

const RegisterPageView = () => {
  const [emailExists, setEmailExists] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const router = useRouter();

  const {
    visiblePassword,
    togglePasswordVisible
  } = usePasswordVisible(); // COMMON INPUT PROPS FOR TEXT FIELD

  const inputProps = {
    endAdornment: <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
  }; // REGISTER FORM FIELDS INITIAL VALUES

  const initialValues = {
    name: "",
    email: "",
    password: "",
    re_password: "",
    agreement: false
  }; // REGISTER FORM FIELD VALIDATION SCHEMA

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
    re_password: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required("Please re-type password"),
    agreement: yup.bool().test("agreement", "You have to agree with our Terms and Conditions!", value => value === true).required("You have to agree with our Terms and Conditions!")
  });

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Get the user's MetaMask account address
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
        setIsMetaMaskConnected(true);
      } catch (error) {
        console.error('MetaMask error:', error);
      }
    } else {
      console.log("MetaMask is not installed");
    }
  };

  const handleRegister = async (values) => {

    const formData = new FormData();
    formData.append("fullname", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);

    try {
      const response = await fetch('/api-keys/login/api/register', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setCookie(USER_TOKEN, data.token, { expires: 180 });
          setCookie(UID, data.uid, { expires: 180 });
          setCookie(USER_LOCAL_ID, data.localId, { expires: 180 });
          console.log("System is successfully connected");


          router.push('/api-keys');
        } else {
          console.log('Failed: ', data.message);
        }
      } else if (response.status == 409) {
        setEmailExists(true);
        console.log("Email exists");
      } else {
        console.error('Failed to send request:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
    onSubmit: handleRegister
  });

  const handleResetPassword = () => {
    router.push('/reset-password');
  }

  return (
    <form onSubmit={handleSubmit}>
      <BazaarTextField mb={1.5} fullWidth name="name" size="small" label="Full Name" variant="outlined" onBlur={handleBlur} value={values.name} onChange={handleChange} placeholder="Ralph Awards" error={!!touched.name && !!errors.name} helperText={touched.name && errors.name} />

      <BazaarTextField mb={1.5} fullWidth name="email" size="small" type="email" variant="outlined" onBlur={handleBlur} value={values.email} onChange={handleChange} label="Email" placeholder="exmple@mail.com" error={!!touched.email && !!errors.email} helperText={touched.email && errors.email} />

      <BazaarTextField mb={1.5} fullWidth size="small" name="password" label="Password" variant="outlined" autoComplete="on" placeholder="*********" onBlur={handleBlur} onChange={handleChange} value={values.password} type={visiblePassword ? "text" : "password"} error={!!touched.password && !!errors.password} helperText={touched.password && errors.password} InputProps={inputProps} />

      <BazaarTextField fullWidth size="small" autoComplete="on" name="re_password" variant="outlined" label="Retype Password" placeholder="*********" onBlur={handleBlur} onChange={handleChange} value={values.re_password} type={visiblePassword ? "text" : "password"} error={!!touched.re_password && !!errors.re_password} helperText={touched.re_password && errors.re_password} InputProps={inputProps} />

      <FormControlLabel name="agreement" className="agreement" onChange={handleChange} control={<Checkbox size="small" color="secondary" checked={values.agreement || false} />} label={<FlexBox flexWrap="wrap" alignItems="center" justifyContent="flex-start" gap={1}>
        <Span display={{ sm: "inline-block", xs: "none" }}>By signing up, you agree to</Span>
        <Span display={{ sm: "none", xs: "inline-block" }}>Accept Our</Span>
        <BoxLink title="Terms & Condition" href="/privacy" />
      </FlexBox>} />

      {emailExists && (
        <p style={{ color: 'red', marginBottom: '1rem' }}>Email already registered, <Link component="button" variant="body2" onClick={handleResetPassword} style={{ color: 'red', textDecoration: 'underline' }}>Forgot your password?</Link></p>
      )}

      <Button fullWidth type="submit" color="primary" variant="contained" size="large">
        Create Account
      </Button>

    </form>
  );
};

export default RegisterPageView;