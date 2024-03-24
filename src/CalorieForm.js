//Shai Shillo ID: 204684914, Roman Agbyev ID: 322002098, Ofek Daida ID 315143958
import React, { useState } from 'react';
import { TextField, MenuItem, Button, FormControl, InputLabel, Select } from '@mui/material';
import CustomException from "./custom_exceptions";

function CalorieForm({ onSubmit }) {
    // State hooks for managing form inputs and description error state
    const [calorie, setCalorie] = useState(``);
    const [category, setCategory] = useState(``);
    const [description, setDescription] = useState(``);
    const [descriptionError, setDescriptionError] = useState(false);
    const [calorieError, setCalorieError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Reset any previous error state
        setDescriptionError(false);
        // Validate description input
        const isDescriptionValid = description.trim() !== ``;

        if (!isDescriptionValid) {
            // Set error state for description
            setDescriptionError(true);
            return; // Prevent form submission
        }
        try {
            await onSubmit({calorie, category, description: description.trim()});

            // Clear the form fields after successful submission
            setCalorie(``);
            setCategory(``);
            setDescription(``);
        } catch (error){
            if (error instanceof CustomException){
                console.error('Custom Exception caught:', error.message, error.details);
                //Handle the custom exception here as required
            } else {
                //Handle other types of exceptions if needed
                console.error('Unhandled exception:', error);
            }
        }
    };
    const handleCalorieChange = (e) => {
        const value = e.target.value;

        // Remove the error when the user starts correcting the input to potentially valid values
        if (value === `` || value === `0`) {
            setCalorie(value);
            setCalorieError(true);
        } else if (value.match(/^0\.\d*$/)) {
            setCalorie(value);
            setCalorieError(false);
        } else if (parseFloat(value) > 0 && !isNaN(value)) {
            // Only update the state if the value is greater than 0
            setCalorie(value);
            setCalorieError(false);
        } else {
            // Keep the user's input in the state but mark it as error if it's definitively invalid
            setCalorie(value);
            setCalorieError(true);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <TextField
                error={calorieError}
                helperText={calorieError ? '' : ''}
                label='Calories'
                type='number'
                inputProps={{ min: '0.01', step: '0.01' }} // Set a minimum value and step increment
                variant='outlined'
                value={calorie}
                onChange={handleCalorieChange}
                required
            />
            <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                    labelId='category-select-label'
                    value={category}
                    id='category-select'
                    name='category'
                    label='Category'
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <MenuItem value='BREAKFAST'>Breakfast</MenuItem>
                    <MenuItem value='LUNCH'>Lunch</MenuItem>
                    <MenuItem value='DINNER'>Dinner</MenuItem>
                    <MenuItem value='OTHER'>Other</MenuItem>
                </Select>
            </FormControl>
            <TextField
                error={descriptionError}
                label='Description'
                variant='outlined'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                // Add a pattern that matches at least one non-whitespace character
                inputProps={{
                    pattern: '\\S+.*',
                    title: 'Description cannot be empty or just spaces.'
                }}
            />
            <Button type='submit' variant='contained'>Add Calorie Entry</Button>
        </form>
    );
}
export default CalorieForm;