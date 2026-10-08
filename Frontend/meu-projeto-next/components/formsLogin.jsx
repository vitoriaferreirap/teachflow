import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';



export default function HelperTextAligned() {
    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Box
                sx={{
                    width: {
                        xs: '60%',  // celulares
                        sm: '400px', // telas maiores
                    },
                    maxWidth: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <TextField
                    helperText="Please enter your email"
                    id="demo-helper-text-aligned"
                    label="Email"
                />
                <TextField
                    helperText="Password"
                    id="demo-helper-text-aligned-no-helper"
                    label="Password"
                />



                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <Link href="#">recuperar acesso</Link>
                    <Link href="#">cadastrar</Link>
                    <Checkbox control={<Checkbox defaultChecked />} label="Label" />
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                >
                    Entrar
                </Button>


            </Box >
        </Box>
    );
}
