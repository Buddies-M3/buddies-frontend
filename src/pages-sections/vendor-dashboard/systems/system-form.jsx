import { useState } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
  Box, Dialog,
  DialogActions, DialogContent, DialogContentText,
  DialogTitle, IconButton
} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import Switch from '@mui/material/Switch';
import { Formik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/navigation";

import { generateApiKey } from "utils/misc-utils";

// FORM FIELDS VALIDATION SCHEMA
const VALIDATION_SCHEMA = yup.object().shape({
  name: yup.string().required("Name is required!"),
  expiry: yup.date().nullable(),
});

const SystemForm = (props) => {
  const {ownerId} = props;
  const router = useRouter();
  const [hasExpiry, setHasExpiry] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleToggleExpiry = (e) => {
    setHasExpiry(e.target.checked);
  };

  const handleCreateAPIKey = async (values) => {
    console.log("API key form values: ", values);
    const key = generateApiKey(128);

    const response = await fetch('/api-keys/api-keys/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, api_key: key }),
    });

    if (response.status === 201) {
      const newKey = await response.json();
      setGeneratedKey(key);
      setShowDialog(true);
      console.log("New API key: ", newKey);
    } else if (response.status === 500) {
      const error = await response.json();
      console.error("System error, try later:", error);
    } else {
      console.error("Something went wrong, try later");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setGeneratedKey('');
    router.push('/');
  };

  return (
    <Card sx={{ p: 6 }}>
      <Formik
        initialValues={{
          name: '',
          expiry: undefined,
          ownerId: ownerId
        }}
        validationSchema={VALIDATION_SCHEMA}
        onSubmit={handleCreateAPIKey}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="name"
                  label="Name"
                  color="info"
                  size="medium"
                  placeholder="Name"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name} />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={hasExpiry}
                      onChange={handleToggleExpiry}
                      name="hasExpiry"
                      color="primary"
                    />
                  }
                  label="Set Expiry Date"
                />
              </Grid>
              {hasExpiry && (
                <Grid item xs={12}>
                  <TextField
                    name="expiry"
                    label="Expiry"
                    type="date"
                    size="medium"
                    value={values.expiry}
                    onChange={handleChange}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}

              <Grid item sm={6} xs={12}>
                <Button variant="contained" color="info" type="submit">
                  {"Create"}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
      <Dialog open={showDialog} onClose={handleCloseDialog}>
        <DialogTitle>API Key Generated</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ paddingBottom: 2 }}>
            Warning: This API key will not be shown again for security reasons. Please copy it now and keep it in a secure place.
          </DialogContentText>
          <Box
            component="div"
            sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 1, borderRadius: 1 }}
          >
            <TextField
              value={generatedKey}
              fullWidth
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    {copied ? (
                      <CheckIcon />
                    ) : (
                      <IconButton onClick={handleCopy}>
                        <ContentCopyIcon />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default SystemForm;