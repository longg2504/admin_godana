import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import React from 'react';
const ProvinceSelect = () => {
    // Giả sử ID và tên của "Thành Phố Đà Nẵng"
    const daNangProvince = { id: '48', title: 'Thành Phố Đà Nẵng' };

    return (
        <FormControl fullWidth margin="normal">
            <InputLabel id="province-label">Province</InputLabel>
            <Select
                labelId="province-label"
                id="province-select"
                value={daNangProvince.id} // Trực tiếp sử dụng giá trị cố định
                input={<OutlinedInput label="Province" />}
                disabled={true} // Disable Select để người dùng không thể tương tác
            >
                <MenuItem value={daNangProvince.id}>{daNangProvince.title}</MenuItem>
            </Select>
        </FormControl>
    );
}
export default ProvinceSelect;