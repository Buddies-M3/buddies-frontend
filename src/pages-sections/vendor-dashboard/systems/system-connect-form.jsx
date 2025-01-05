import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { styled } from '@mui/system';

import { H6 } from "components/Typography";

import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Avatar, Stepper, Step, StepLabel } from '@mui/material';
import { Formik } from "formik";
import * as yup from "yup";

// GLOBAL CUSTOM COMPONENTS

import { FlexBox } from "components/flex-box";

// STYLED COMPONENTS

import { UploadImageBox, StyledClear } from "../styles";


import api from 'utils/__api__/systems';
import { kWh } from "lib";
import { backend } from "utils/constants";
import SolarSystem from "components/system/solar-system";
import { showToast } from "utils/misc-utils";

// FORM FIELDS VALIDATION SCHEMA

const VALIDATION_SCHEMA = yup.object().shape({
  name: yup.string().required("Name is required!"),
  type: yup.string().required("Type is required!"),
  capacity: yup.number().required("Capacity is required!"),
}); // ================================================================


const SelectedImageBox = styled(Box)(({ selected }) => ({
  position: 'relative',
  border: selected ? '2px solid blue' : '2px solid transparent',
  borderRadius: 8,
  overflow: 'hidden',
  cursor: 'pointer',
}));

// ================================================================
const SystemConnectForm = props => {
  const {
    initialValues,
    handleFormSubmit,
    selectedSiteIndex,
    edit = false
  } = props;

  const [activeStep, setActiveStep] = useState(0);
  const [selectedSite, setSelectedSite] = useState(selectedSiteIndex);
  const [smeterOptions, setSMeterOptions] = useState([]);
  const [selectedSMeter, setSelectedSMeter] = useState();
  const [serialVerified, setSerialVerified] = useState(false);
  const [piVerified, setPinVerified] = useState(false);
  const [serialNumber, setSerialNumber] = useState('');
  const [verifiedSmeterId, setVerifiedSmeterId] = useState();



  const serialFieldRef = useRef(null);
  const pinFieldRef = useRef(null);


  const steps = [
    {
      title: 'Select a Project',
      image: '/assets/images/system/solar-site-01.png'
    },
    {
      title: 'Select Smart Terminal',
      image: '/assets/images/system/smeter-01.png'
    },
    {
      title: 'Verify your Smart Terminal',
      image: '/assets/images/system/solar-site-01.png'
    },
    {
      title: 'Connect Project',
      image: '/assets/images/system/load-01.png'
    }
  ];

  const handleImageClick = (index) => {
    setSelectedSMeter(index);
  };

  useEffect(() => {
    const fetchRelevant = async () => {
      const formData = new FormData();
      formData.append("capacity", JSON.stringify(initialValues.sites[selectedSite].capacity));
      try {
        const response = await fetch('/projects/api/relevant_smeter', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success') {
            setSMeterOptions([data.data]);
          }
        } else {
          //showToast("System creation failed", true);
          console.error('Failed to send request:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchRelevant();

  }, [selectedSite]);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSerialVerify = async () => {
    if (serialFieldRef.current) {
      const value = serialFieldRef.current.value;
      const formData = new FormData();
      formData.append("serial", value);
      formData.append("smeterid", smeterOptions[selectedSMeter].id);
      try {
        const response = await fetch('/projects/api/verify_smeter_serial', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success') {
            setSerialVerified(true);
            setSerialNumber(value);
            handleNext();
          }
        } else {
          setSerialVerified(false);
          console.error('Failed to verify Smart');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handlePinVerify = async () => {
    if (pinFieldRef.current) {
      const pin = pinFieldRef.current.value;
      const formData = new FormData();
      formData.append("serial", serialNumber);
      formData.append("pin", pin);
      try {
        const response = await fetch('/projects/api/verify_smeter_pin', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success') {
            console.log(data);
            setSerialVerified(true);
            setVerifiedSmeterId(data.data.id);
            handleNext();
          }
        } else {
          const data = await response.json();
          console.log(data);
          setSerialVerified(false);
          console.error('Failed to verify Smart');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <Card sx={{ p: 6 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step.title}>
            <StepLabel>
              <div>
                {step.title}
                {/* <Box component="img" src={step.image} sx={{ mt: 2, mb: 2, width: '160px' }} /> */} {/* Adjust the path to your icons */}
              </div>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <Formik
        onSubmit={(values) => handleFormSubmit({ ...values, smeterid: verifiedSmeterId, siteid: values.sites[selectedSite].id })}
        initialValues={initialValues}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit
        }) => (
          <form onSubmit={handleSubmit}>
            <div>
              {activeStep === 0 && (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ mt: 4, mb: 4 }}>
                  <Box component="img" src="/assets/images/system/solar-site-01.png" sx={{ mt: 2, mb: 2, width: '160px', paddingBottom: "30px" }} />

                  <TextField
                    select
                    fullWidth
                    color="info"
                    size="medium"
                    name="site"
                    onBlur={handleBlur}
                    placeholder="Type"
                    onChange={(event) => {
                      const selectedSiteId = event.target.value;
                      const selectedIndex = values.sites.findIndex(site => site.id === selectedSiteId);
                      setSelectedSite(selectedIndex);
                      handleChange(event);
                    }}
                    value={values.sites[selectedSite]? values.sites[selectedSite].id : null}
                    label="Select Type"
                    SelectProps={{ multiple: false }}
                    sx={{ maxWidth: "550px" }}
                  >
                    {values.sites.length > 0 && values.sites.map((site) => (
                      <MenuItem key={site.id} value={site.id}>
                        {`${site.name} (${kWh(site.capacity)})`}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Box display="flex" justifyContent="center" width="100%" sx={{ mt: 2 }}>
                    <Button variant="contained" color="info"
                      onClick={() => {
                        console.log(selectedSite);
                        handleNext();
                        if (selectedSite){
                          
                        }
                      }}>
                      Next
                    </Button>
                  </Box>
                </Box>
              )}

              {activeStep === 1 && (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ mt: 4, mb: 4 }} >
                  <H6>{values.sites[selectedSite] ? values.sites[selectedSite].name : null}</H6>
                  <FlexBox flexDirection="row" mt={2} flexWrap="wrap" gap={1} padding={5}>
                    {smeterOptions && smeterOptions.length > 0 && smeterOptions.map((smeter, index) => (
                      <SelectedImageBox
                        key={index}
                        selected={selectedSMeter === index}
                        onClick={() => handleImageClick(index)}
                      >
                        <Box component="img" src={`/assets/images/system/${smeter.imageurl}`} width="100%" height="80px" />
                        <H6 style={{ textAlign: 'center' }}>{smeter.model}</H6>
                      </SelectedImageBox>
                    ))}
                  </FlexBox>
                  {selectedSMeter != null && (
                    <TextField
                      inputRef={serialFieldRef}
                      fullWidth
                      name="smeterserial"
                      label="Serial Number"
                      color="info"
                      size="medium"
                      placeholder="Enter Serial Number"
                      value={values.smeterserial}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={!!touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                      sx={{ maxWidth: "550px" }}
                    />
                  )}
                  <Box display="flex" justifyContent="center" width="100%" sx={{ mt: 2 }} gap={2}>
                    <Button variant="contained" color="info" onClick={handleBack}>
                      Back
                    </Button>
                    <Button variant="contained" color="info" onClick={handleSerialVerify}>
                      Next
                    </Button>
                  </Box>
                </Box>
              )}

              {activeStep === 2 && (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ mt: 4, mb: 4 }}>
                  <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" sx={{ mt: 4, mb: 4 }} gap={10}>
                    <Box component="img" src="/assets/images/system/solar-site-01.png" sx={{ mt: 2, mb: 2, width: '160px' }} />
                    <Box component="img" src={`/assets/images/system/${smeterOptions[selectedSMeter].imageurl}`} width="100%" height="80px" />
                  </Box>
                  <H6 paddingBottom={5}>{values.sites[selectedSite] ? values.sites[selectedSite].name : null}</H6>
                  <TextField
                    fullWidth
                    name="pin"
                    inputRef={pinFieldRef}
                    label="Pin Code"
                    color="info"
                    size="medium"
                    placeholder="Enter Pin Code"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    sx={{ maxWidth: "550px" }}
                  />
                  <Box display="flex" justifyContent="center" width="100%" sx={{ mt: 2 }} gap={2}>
                    <Button variant="contained" color="info" onClick={handleBack}>
                      Back
                    </Button>
                    <Button variant="contained" color="info" onClick={handlePinVerify}>
                      Next
                    </Button>
                  </Box>
                </Box>
              )}

              {activeStep === 3 && (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ mt: 4, mb: 4 }}>
                  <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" sx={{ mt: 4, mb: 4 }} gap={8}>
                  <Box component="img" src="/assets/images/system/solar-site-01.png" sx={{ mt: 2, mb: 2, width: '160px' }} />
                    <Box component="img" src={`/assets/images/system/${smeterOptions[selectedSMeter].imageurl}`} width="100%" height="80px" />
                    <Box component="img" src="/assets/images/system/load-01.png" sx={{ mt: 2, mb: 2, width: '160px' }} />
                  </Box>
                  <Box display="flex" justifyContent="center" width="100%" sx={{ mt: 2 }} gap={2}>
                    <Button variant="contained" color="info" onClick={handleBack}>
                      Back
                    </Button>
                    <Button variant="contained" color="info" type="submit">
                      Connect
                    </Button>
                  </Box>
                </Box>
              )}
            </div>
          </form>
        )}
      </Formik>
    </Card>
  );
};

export default SystemConnectForm;