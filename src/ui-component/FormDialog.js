import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

function FormDialog({ open, onClose, onSave, editData, fields }) {
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    // Đây là điểm khác biệt chính, chúng tôi sẽ xử lý initData dựa trên cấu trúc của fields
    // Nếu field có specify how to get value from editData, sử dụng logic đó
    // Nếu không, fallback về logic cũ: editData[field.name]
    const initData = fields.reduce((acc, field) => {
      const value = editData && field.editDataKey ? editData[field.editDataKey] : editData ? editData[field.name] : '';
      return { ...acc, [field.name]: value };
    }, {});
    reset(initData);
  }, [editData, fields, open, reset]);

  const onSubmit = data => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editData ? 'Edit Item' : 'Add New Item'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map(field => (
            <FormControl key={field.name} fullWidth margin="normal">
              {field.type === 'select' ? (
                <Controller
                  name={field.name}
                  control={control}
                  rules={{ required: field.required ? 'This field is required' : undefined }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                      <InputLabel>{field.label}</InputLabel>
                      <Select
                        value={value}
                        onChange={onChange}
                        label={field.label}
                        error={!!error}
                      >
                        {field.options?.map(option => (
                          <MenuItem key={option.id} value={option.id}>{option.label}</MenuItem>
                        ))}
                      </Select>
                      {error && <p style={{ color: 'red' }}>{error.message}</p>}
                    </>
                  )}
                />
              ) : (
                <Controller
                  name={field.name}
                  control={control}
                  rules={{ required: field.required ? 'This field is required' : undefined }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      label={field.label}
                      type={field.type}
                      value={value}
                      onChange={onChange}
                      multiline={field.type === 'textarea'}
                      rows={field.type === 'textarea' ? 4 : 1}
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  )}
                />
              )}
            </FormControl>
          ))}
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FormDialog;
