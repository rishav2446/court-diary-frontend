import React from 'react';
import { Toaster } from 'react-hot-toast';

/**
 * Global Toast Provider — place once at the app root
 * Uses react-hot-toast with custom Court Diary styles
 */
const ToastProvider = () => (
  <Toaster
    position="top-right"
    reverseOrder={false}
    gutter={10}
    containerStyle={{ top: 72 }}
    toastOptions={{
      duration: 4000,
      style: {
        background: 'hsl(0, 0%, 100%)',
        color: 'hsl(220, 45%, 15%)',
        border: '1px solid rgba(15, 23, 42, 0.08)',
        borderRadius: '10px',
        fontSize: '14px',
        fontFamily: "'Inter', sans-serif",
        fontWeight: '500',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
        backdropFilter: 'blur(20px)',
        padding: '12px 16px',
        maxWidth: '360px',
      },
      success: {
        iconTheme: {
          primary: 'hsl(142, 72%, 35%)',
          secondary: '#ffffff',
        },
        style: {
          borderColor: 'rgba(16, 185, 129, 0.2)',
        },
      },
      error: {
        iconTheme: {
          primary: 'hsl(354, 75%, 48%)',
          secondary: '#ffffff',
        },
        style: {
          borderColor: 'rgba(239, 68, 68, 0.2)',
        },
        duration: 5000,
      },
      loading: {
        iconTheme: {
          primary: 'hsl(217, 91%, 56%)',
          secondary: '#ffffff',
        },
      },
    }}
  />
);

export default ToastProvider;
