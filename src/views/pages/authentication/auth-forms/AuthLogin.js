import { useState} from 'react';
import { Formik } from 'formik';
import * as yup from 'yup'; // Re-enabled yup for validation
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
import AnimateButton from 'ui-component/extended/AnimateButton';

// API functions
import { loginUser } from 'constant/constURL/URLAuth';  // Ensure the path is correctly set

import { ADMIN } from 'constant/AppConstant';
import swal from 'sweetalert';

// Validation schema using yup
const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().min(6, "Password should be of minimum 6 characters length").required("Password is required"),
});

const FirebaseLogin = (props) => {
  const theme = useTheme();
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
      initialValues={{ username: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          const response = await loginUser(values);
          const { token, roles, id, username } = response.data;
          localStorage.setItem('authData', JSON.stringify({ token, roles }));
          localStorage.setItem('id', JSON.stringify(token, id));
          localStorage.setItem('username', JSON.stringify(token, username));
          // Check if the roles array includes an object with 'authority' equal to 'ADMIN'
          const isAdmin = response.data.roles.some(role => role.authority === ADMIN);
      
          if (isAdmin) {
            navigate("/dashboard/report");
            swal.fire({
              title: "Success!",
              text: "Login successful!",
              icon: "success",
              timer: 2000
            });
          } else {
            // If the user is authenticated but not an admin, throw a specific error
            throw new Error('Access Denied: You do not have administrator privileges.');
          }
        } catch (error) {
          console.error("Login error:", error);
      
          // Error handling based on HTTP status codes or specific error messages
          let message = 'Access Denied: You do not have administrator privileges.';
          if (error.response) {
            switch (error.response.status) {
              case 401: // Unauthorized
                message = 'Invalid credentials. Please check your username and password.';
                break;
              case 403: // Forbidden
                message = 'Access Denied: You do not have administrator privileges.';
                break;
              case 404: // Not Found
                message = 'Account does not exist.';
                break;
              default:
                message = error.response.data?.message || message;
            }
          }
          
          setStatus({ success: false });
          setErrors({ submit: message });
          setSubmitting(false);
          swal.fire("Error!", message, "error");
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} {...props}>
          <FormControl fullWidth error={Boolean(touched.username && errors.username)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-username-login">Username</InputLabel>
            <OutlinedInput
              id="outlined-adornment-username-login"
              type="username"
              value={values.username}
              name="username"
              onBlur={handleBlur}
              onChange={handleChange}
              label="Username"
            />
            {touched.username && errors.username && (
              <FormHelperText error id="standard-weight-helper-text-username-login">{errors.username}</FormHelperText>
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
