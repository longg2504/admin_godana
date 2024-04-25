import { useState } from 'react';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
// Material-UI components
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
} from '@mui/material';

// Icons
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Custom hooks and components
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// API functions
import { loginUser } from 'constant/constURL/URLAuth';  // Adjust the path to your actual API file location

// ============================|| FIREBASE - LOGIN COMPONENT ||============================ //

const FirebaseLogin = (props) => {
  const theme = useTheme();
  const scriptRef = useScriptRef();
  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const preventDefault = (event) => {
    event.preventDefault();
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        submit: null
      }}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          const response = await loginUser({
            username: values.email,
            password: values.password
          });

          if (scriptRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
            console.log('Login successful:', response.data);
            navigate('/dashboard/default');
          }
        } catch (error) {
          console.error(error);
          if (scriptRef.current) {
            setStatus({ success: false });
            setErrors({ submit: error.response.data.message || 'Unknown error' });
            setSubmitting(false);
          }
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} {...props}>
          <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
            <OutlinedInput
              id="outlined-adornment-email-login"
              type="email"
              value={values.email}
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              label="Email Address / Username"
            />
            {touched.email && errors.email && (
              <FormHelperText error id="standard-weight-helper-text-email-login">{errors.email}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password-login"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    onMouseDown={preventDefault}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
            {touched.password && errors.password && (
              <FormHelperText error id="standard-weight-helper-text-password-login">{errors.password}</FormHelperText>
            )}
          </FormControl>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} name="checked" color="primary" />}
              label="Remember me"
            />
          </Stack>
          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                Sign in
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default FirebaseLogin;
