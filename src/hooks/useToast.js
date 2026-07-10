import { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

export const useToast = () => {
  const showSuccess = useCallback((message) => toast.success(message), []);
  const showError = useCallback((message) => toast.error(message), []);
  const showLoading = useCallback((message) => toast.loading(message), []);
  const dismiss = useCallback((toastId) => toast.dismiss(toastId), []);

  const promise = useCallback((promiseObj, loadingMsg, successMsg, errorMsg) => {
    return toast.promise(promiseObj, {
      loading: loadingMsg,
      success: successMsg,
      error: errorMsg || ((err) => err?.message || 'Something went wrong'),
    });
  }, []);

  return useMemo(() => ({
    success: showSuccess,
    error: showError,
    loading: showLoading,
    dismiss,
    promise,
  }), [showSuccess, showError, showLoading, dismiss, promise]);
};

