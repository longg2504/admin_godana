import React, { useState, useEffect } from 'react';
import {
    Grid, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

const createTimeOptions = (start, end, step) => {
    const options = [];
    for (let i = start; i <= end; i += step) {
        options.push(<MenuItem key={i} value={`${i < 10 ? `0${i}` : i}`}>{`${i < 10 ? `0${i}` : i}`}</MenuItem>);
    }
    return options;
};

const TimeSelect = ({ onTimeChange, initialOpenTime = '', initialCloseTime = '', reset }) => {
    const [timeSetting, setTimeSetting] = useState('');
    const [openHour, setOpenHour] = useState('');
    const [openMinute, setOpenMinute] = useState('');
    const [closeHour, setCloseHour] = useState('');
    const [closeMinute, setCloseMinute] = useState('');
    useEffect(() => {
        if (reset) {
            setTimeSetting(''); // Reset the selected option
        }
    }, [reset]);

    useEffect(() => {
        if (initialOpenTime === '00:00' && initialCloseTime === '23:59') {
            setTimeSetting('all_day');
        } else if (initialOpenTime && initialCloseTime) {
            setTimeSetting('specific_time');
            const [openH, openM] = initialOpenTime.split(':');
            const [closeH, closeM] = initialCloseTime.split(':');
            setOpenHour(openH);
            setOpenMinute(openM);
            setCloseHour(closeH);
            setCloseMinute(closeM);
        }
    }, [initialOpenTime, initialCloseTime]);

    const handleTimeChange = (field, value) => {
        if (field === 'openTime') {
            const [hour, minute] = value.split(':');
            setOpenHour(hour);
            setOpenMinute(minute);
            if (parseInt(hour) > parseInt(closeHour) || (hour === closeHour && parseInt(minute) > parseInt(closeMinute))) {
                setCloseHour(hour);
                setCloseMinute((parseInt(minute) + 5).toString().padStart(2, '0'));
            }
            onTimeChange('openTime', `${hour}:${minute}`);
        } else if (field === 'closeTime') {
            const [hour, minute] = value.split(':');
            if (parseInt(hour) > parseInt(openHour) || (hour === openHour && parseInt(minute) > parseInt(openMinute))) {
                setCloseHour(hour);
                setCloseMinute(minute);
                onTimeChange('closeTime', `${hour}:${minute}`);
            }
        }
    };

    const handleTimeSettingChange = (event) => {
        const setting = event.target.value;
        setTimeSetting(setting);
    
        if (setting === 'all_day') {
            setOpenHour('00');
            setOpenMinute('00');
            setCloseHour('23');
            setCloseMinute('59');
            onTimeChange('openTime', '00:00');
            onTimeChange('closeTime', '23:59');
        } else {
            setOpenHour('');
            setOpenMinute('');
            setCloseHour('');
            setCloseMinute('');
            onTimeChange('openTime', '');
            onTimeChange('closeTime', '');
        }
    };
    

    return (
        <FormControl fullWidth style={{ marginTop: '16px' }}>
            <InputLabel id="time-setting-label">Chọn Thời Gian</InputLabel>
            <Select
                labelId="time-setting-label"
                id="time-setting"
                value={timeSetting}
                onChange={handleTimeSettingChange}
                fullWidth
            >
                <MenuItem value="all_day">Mở cả ngày</MenuItem>
                <MenuItem value="specific_time">Mốc thời gian</MenuItem>
            </Select>
            {timeSetting === 'specific_time' && (
                <Grid container spacing={2} style={{ marginTop: 8 }}>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Giờ mở cửa</InputLabel>
                            <Select value={openHour} onChange={(e) => handleTimeChange('openTime', `${e.target.value}:${openMinute}`)}>
                                {createTimeOptions(0, 23, 1)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Phút mở cửa</InputLabel>
                            <Select value={openMinute} onChange={(e) => handleTimeChange('openTime', `${openHour}:${e.target.value}`)}>
                                {createTimeOptions(0, 55, 5)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Giờ đóng cửa</InputLabel>
                            <Select value={closeHour} onChange={(e) => handleTimeChange('closeTime', `${e.target.value}:${closeMinute}`)}>
                                {createTimeOptions(parseInt(openHour) + 1, 23, 1)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Phút đóng cửa</InputLabel>
                            <Select value={closeMinute} onChange={(e) => handleTimeChange('closeTime', `${closeHour}:${e.target.value}`)}>
                                {createTimeOptions(0, 55, 5)}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            )}
        </FormControl>
    );
};

export default TimeSelect;
