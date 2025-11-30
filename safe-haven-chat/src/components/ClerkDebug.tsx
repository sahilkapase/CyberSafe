import { SignInButton, SignUpButton, useAuth } from '@clerk/clerk-react';
import { Box, Button, Typography } from '@mui/material';

export default function ClerkDebug() {
    const { isLoaded, isSignedIn } = useAuth();

    return (
        <Box sx={{ p: 4, border: '2px solid red', m: 2 }}>
            <Typography variant="h6">Clerk Debug Info:</Typography>
            <Typography>Clerk Loaded: {isLoaded ? 'Yes' : 'No'}</Typography>
            <Typography>Signed In: {isSignedIn ? 'Yes' : 'No'}</Typography>
            <Typography>Publishable Key: {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.substring(0, 20)}...</Typography>

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <SignUpButton mode="modal">
                    <Button variant="contained">Test Sign Up (Modal)</Button>
                </SignUpButton>

                <SignInButton mode="modal">
                    <Button variant="outlined">Test Sign In (Modal)</Button>
                </SignInButton>
            </Box>
        </Box>
    );
}
