import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";

const LocationRegionSelect = ({ label, options, onSelectionChange, name, disabled = false, selectedOption, reset }) => {
    const [currentSelection, setCurrentSelection] = useState(selectedOption);

    useEffect(() => {
        if (reset) {
            setCurrentSelection(''); // Reset the selected option
        }
    }, [reset]);

    useEffect(() => {
        if (selectedOption) {
            setCurrentSelection(selectedOption);
        }
    }, [selectedOption]);

    const handleChange = (event) => {
        const newSelection = event.target.value;
        setCurrentSelection(newSelection); // Update the local state
        if (onSelectionChange) {
            onSelectionChange(name, newSelection); // Pass both the field name and value
        }
    };

    return (
        <FormControl fullWidth margin="normal" >
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            <Select
                labelId={`${label}-label`}
                id={`${label}`}
                value={currentSelection}
                onChange={handleChange}
                input={<OutlinedInput label={label} />}
                disabled={disabled}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option.id}
                        value={option.id}
                    >
                        {option.title}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default LocationRegionSelect;