import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';

function FormDialog({ open, onClose, onSave, editData, fields }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const initData = fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: editData ? editData[field.name] : ''
    }), {});
    setFormData(initData);
  }, [editData, fields, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editData ? 'Edit Item' : 'Add New Item'}</DialogTitle>
      <DialogContent>
      {fields.map(field => (
        <FormControl key={field.name} fullWidth margin="normal">
          {field.type === 'select' ? (
            <>
              <InputLabel>{field.label}</InputLabel>
              <Select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                label={field.label}
              >
                {field.options.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </>
          ) : (
            <TextField
              name={field.name}
              label={field.label}
              type={field.type === 'textarea' ? 'text' : field.type}
              value={formData[field.name]}
              onChange={handleChange}
              multiline={field.type === 'textarea'}
              rows={field.type === 'textarea' ? 4 : 1}
            />
          )}
        </FormControl>
      ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default FormDialog;
