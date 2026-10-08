'use client';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import * as React from 'react';

export default function InputAdornments() {
    const outlinedStartId = React.useId();
    const outlinedWeightId = React.useId();
    const outlinedPasswordId = React.useId();
    const outlinedAmountId = React.useId();
    const filledStartId = React.useId();
    const filledWeightId = React.useId();
    const filledPasswordId = React.useId();
    const filledAmountId = React.useId();
    const standardStartId = React.useId();
    const standardWeightId = React.useId();
    const standardPasswordId = React.useId();
    const standardAmountId = React.useId();
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    // An endAdornment coexists with the Select's chevron without overlapping it.
    const infoEndAdornment = (
        <InputAdornment position="end">
            <span aria-hidden="true">i</span>
        </InputAdornment>
    );

    const infoStartAdornment = (
        <InputAdornment position="start">
            <span aria-hidden="true">i</span>
        </InputAdornment>
    );

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <div>
                <TextField
                    id={`${outlinedStartId}-input`}
                    sx={{ m: 1, width: '25ch' }}
                    slotProps={{
                        input: {
                            startAdornment: <InputAdornment position="start">Nome</InputAdornment>,
                        },
                    }}
                />


                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <InputLabel htmlFor={`${outlinedPasswordId}-input`}>Password</InputLabel>
                    <OutlinedInput
                        id={`${outlinedPasswordId}-input`}
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={
                                        showPassword ? 'hide the password' : 'display the password'
                                    }
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                    edge="end"
                                >
                                    {showPassword ? 'Ocultar' : 'Mostrar'}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                </FormControl>

                <TextField
                    select
                    label="Select"
                    defaultValue={20}
                    variant="standard"
                    sx={{ m: 1, width: '25ch' }}
                    slotProps={{ select: { endAdornment: infoEndAdornment } }}
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </TextField>
            </div>

        </Box>
    );
}