//Shai Shillo ID: 204684914, Roman Agbyev ID: 322002098, Ofek Daida ID 315143958
import React, { useState } from 'react';
import {
  Button, FormControl, InputLabel,
  Select, MenuItem, Table,
  TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import CustomException from "./custom_exceptions";

//Our report component
function CalorieReport({ getReportData, reportData }) {
  //Stores the selected month
  const [month, setMonth] = useState(``);
  //Stores the selected year
  const [year, setYear] = useState(``);

  //Checks if a search has been requested to prompt the search result
  const [searchPerformed, setSearchPerformed] = useState(false);

  //Handle month selection change
  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  //Handle year selection change
  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  //Handle a request to create and fetch report
  const handleSubmit = async (event) => {
    //We don't allow empty values for month and year
    event.preventDefault();
    //Change searchPerformed state to true to indicate a report needs to be displayed
    setSearchPerformed(true);
    try {
      //Wait for the report generation for the selected month and year
      await getReportData(month, year);
    } catch (error){
      if (error instanceof CustomException){
        console.error('Custom Exception caught:', error.message, error.details);
        //Handle the custom exception here as required
      } else {
        //Handle other types of exceptions if needed
        console.error('Unhandled exception:', error);
      }
      //reportData([]);
    }
    /*} catch (error) {
      console.error(`Error fetching report data:`, error);
      reportData([]);
    }*/
  };

  return (
      <div>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <InputLabel>Month</InputLabel>
            <Select value={month} labelId='month-select-label'
                    id='month-select'
                    name='month' label='Month' onChange={handleMonthChange} required>
              <MenuItem value={1}>January</MenuItem>
              <MenuItem value={2}>February</MenuItem>
              <MenuItem value={3}>March</MenuItem>
              <MenuItem value={4}>April</MenuItem>
              <MenuItem value={5}>May</MenuItem>
              <MenuItem value={6}>June</MenuItem>
              <MenuItem value={7}>July</MenuItem>
              <MenuItem value={8}>August</MenuItem>
              <MenuItem value={9}>September</MenuItem>
              <MenuItem value={10}>October</MenuItem>
              <MenuItem value={11}>November</MenuItem>
              <MenuItem value={12}>December</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select value={year} name='year' labelId='year-select-label' id='year-select' label='Year' onChange={handleYearChange} required>
              <MenuItem value={2023}>2023</MenuItem>
              <MenuItem value={2024}>2024</MenuItem>
            </Select>
          </FormControl>
          <Button type='submit' variant='contained'>Get Report</Button>
        </form>

        {searchPerformed && (
            reportData.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table aria-label='simple table'>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                        <TableCell align='right' sx={{ fontWeight: 'bold' }}>Calories</TableCell>
                        <TableCell align='right' sx={{ fontWeight: 'bold' }}>Category</TableCell>
                        <TableCell align='right' sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.map((entry, index) => (
                          <TableRow key={index}>
                            <TableCell component='th' scope='row'>{entry.description}</TableCell>
                            <TableCell align='right'>{entry.calorie}</TableCell>
                            <TableCell align='right'>{entry.category}</TableCell>
                            <TableCell align='right'>{`${entry.day}/${entry.month}/${entry.year}`}</TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
            ) : <p>No data found for the selected period</p>
        )}
      </div>
  );
}

export default CalorieReport;
