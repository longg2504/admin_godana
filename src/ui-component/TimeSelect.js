import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';

const createTimeOptions = (start, end, increment) => {
  const items = [];
  for (let i = start; i <= end; i += increment) {
    const value = i.toString().padStart(2, '0');
    items.push(<MenuItem key={value} value={value}>{value}</MenuItem>);
  }
  return items;
};

const TimeSelect = ({ onTimeChange }) => {
  const [timeSetting, setTimeSetting] = useState('all_day');
  const [openHour, setOpenHour] = useState('00');
  const [openMinute, setOpenMinute] = useState('00');
  const [closeHour, setCloseHour] = useState('23');
  const [closeMinute, setCloseMinute] = useState('59');

  const handleTimeSettingChange = (event) => {
    const setting = event.target.value;
    setTimeSetting(setting);
    if (setting === 'all_day') {
      onTimeChange('openTime', '00:00');
      onTimeChange('closeTime', '23:59');
    } else {
      onTimeChange('openTime', `${openHour}:${openMinute}`);
      onTimeChange('closeTime', `${closeHour}:${closeMinute}`);
    }
  };

  const handleOpenTimeChange = (hour, minute) => {
    setOpenHour(hour);
    setOpenMinute(minute);
    onTimeChange('openTime', `${hour}:${minute}`);
  };

  const handleCloseTimeChange = (hour, minute) => {
    setCloseHour(hour);
    setCloseMinute(minute);
    onTimeChange('closeTime', `${hour}:${minute}`);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="time-select-label">Set Time</InputLabel>
      <Select
        labelId="time-select-label"
        value={timeSetting}
        onChange={handleTimeSettingChange}
        fullWidth
      >
        <MenuItem value="all_day">Mở cả ngày</MenuItem>
        <MenuItem value="specific_time">Mốc thời gian</MenuItem>
      </Select>
      {timeSetting === 'specific_time' && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Giờ mở cửa</InputLabel>
              <Select value={openHour} onChange={(e) => handleOpenTimeChange(e.target.value, openMinute)}>
                {createTimeOptions(0, 23, 1)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Phút mở cửa</InputLabel>
              <Select value={openMinute} onChange={(e) => handleOpenTimeChange(openHour, e.target.value)}>
                {createTimeOptions(0, 55, 5)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Giờ đóng cửa</InputLabel>
              <Select value={closeHour} onChange={(e) => handleCloseTimeChange(e.target.value, closeMinute)}>
                {createTimeOptions(0, 23, 1)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Phút đóng cửa</InputLabel>
              <Select value={closeMinute} onChange={(e) => handleCloseTimeChange(closeHour, e.target.value)}>
                {createTimeOptions(0, 55, 5)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      )}
    </FormControl>
  );
};
