import React from 'react';
import { TextField } from '@mui/material';

const CustomTextField = ({ label, name, value, onChange, type = 'text', ...rest }) => {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      fullWidth
      variant="outlined"
      {...rest}
    />
  );
};

export default CustomTextField;
