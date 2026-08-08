import { useCallback, useEffect, useRef } from 'react';
import { authService } from '../services/authService';
import {
  buildFacebookOAuthUrl,
  initGoogleSignIn,
  loadFacebookSdk,
  loginWithFacebookPopup,
  shouldUseFacebookRedirect,
  triggerGoogleButton,
} from '../utils/socialAuth';

type AuthPayload = { user?: unknown; message?: string };

type UseSocialAuthActionsOptions = {
  onSuccess: (data: AuthPayload) => void;
  onError: (message: string) => void;
  setLoading: (loading: boolean) => void;
};

export function useSocialAuthActions({
  onSuccess,
  onError,
  setLoading,
}: UseSocialAuthActionsOptions) {
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      return;
    }

    const mountGoogle = () => {
      initGoogleSignIn(
        clientId,
        (credential) => {
          setLoading(true);
          void (async () => {
            try {
              const data = await authService.loginWithGoogle(credential);
              onSuccess(data);
            } catch (err: unknown) {
              const message =
                err && typeof err === 'object' && 'message' in err
                  ? String((err as { message?: string }).message)
                  : 'Đăng nhập Google thất bại';
              onError(message);
            } finally {
              setLoading(false);
            }
          })();
        },
        googleBtnRef.current,
      );
    };

    if (window.google?.accounts?.id) {
      mountGoogle();
      return;
    }

    const timer = window.setInterval(() => {
      if (!window.google?.accounts?.id) {
        return;
      }
      window.clearInterval(timer);
      mountGoogle();
    }, 200);

    return () => window.clearInterval(timer);
  }, [onError, onSuccess, setLoading]);

  const triggerGoogleLogin = useCallback(() => {
    triggerGoogleButton(googleBtnRef.current);
  }, []);

  const handleFacebookLogin = useCallback(async () => {
    const appId = import.meta.env.VITE_FACEBOOK_APP_ID;
    if (!appId) {
      onError('Chưa cấu hình VITE_FACEBOOK_APP_ID');
      return;
    }

    setLoading(true);

    if (shouldUseFacebookRedirect()) {
      sessionStorage.setItem('fb_oauth_pending', '1');
      window.location.href = buildFacebookOAuthUrl(appId);
      return;
    }

    try {
      await loadFacebookSdk(appId);
      loginWithFacebookPopup({
        onSuccess: (accessToken) => {
          void (async () => {
            try {
              const data = await authService.loginWithFacebook(accessToken);
              onSuccess(data);
            } catch (err: unknown) {
              const message =
                err && typeof err === 'object' && 'message' in err
                  ? String((err as { message?: string }).message)
                  : 'Đăng nhập Facebook thất bại';
              onError(message);
            } finally {
              setLoading(false);
            }
          })();
        },
        onError: (message) => {
          onError(message);
          setLoading(false);
        },
        onCancel: () => setLoading(false),
      });
    } catch {
      onError('Không tải được Facebook SDK. Vui lòng thử lại.');
      setLoading(false);
    }
  }, [onError, onSuccess, setLoading]);

  return {
    googleBtnRef,
    triggerGoogleLogin,
    handleFacebookLogin,
  };
}
