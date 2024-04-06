import React, { useState, useEffect } from 'react';
import { useTheme, FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material';
import axios from 'axios'; // Đảm bảo đã cài đặt axios

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export function MultipleSelect({ label }) {
  const theme = useTheme();
  const [selectedNames, setSelectedNames] = useState([]);
  const [options, setOptions] = useState([]); // State mới để quản lý options từ API

  useEffect(() => {
    // Giả sử API là "/api/categories"
    axios.get('/api/category')
      .then(response => {
        // Cập nhật state options với dữ liệu nhận được
        setOptions(response.data.categories); // Điều chỉnh dựa vào cấu trúc phản hồi của bạn
      })
      .catch(error => console.error('There was an error!', error));
  }, []); // Mảng rỗng đảm bảo rằng useEffect chỉ chạy một lần sau khi component mount

  const handleChange = (event) => {
    const { target: { value } } = event;
    setSelectedNames(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id={`${label}-multiple-name-label`}>{label}</InputLabel>
        <Select
          labelId={`${label}-multiple-name-label`}
          id={`${label}-multiple-name`}
          multiple
          value={selectedNames}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          MenuProps={MenuProps}
        >
          {options.map((option) => (
            <MenuItem
              key={option}
              value={option}
              // Giả sử mỗi option là một đối tượng với "name" là trường bạn muốn hiển thị
              style={{ fontWeight: selectedNames.indexOf(option.name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium }}
            >
              {option.name} {/* Điều chỉnh dựa vào cấu trúc dữ liệu của bạn */}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
