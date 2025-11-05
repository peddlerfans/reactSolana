import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export default function GlobalSnackbar({ open, onClose, message, severity = "success" }) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={2500}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                sx={{ width: '100%' }}
                variant="filled"
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
