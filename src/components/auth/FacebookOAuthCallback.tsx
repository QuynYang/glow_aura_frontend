import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { User } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { getPostLoginPath } from '../../utils/authRoles';
import {
  clearFacebookOAuthHash,
  parseFacebookAccessTokenFromUrl,
} from '../../utils/socialAuth';

/** Xử lý token Facebook trả về qua redirect OAuth (HTTP localhost). */
export function FacebookOAuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) {
      return;
    }

    const accessToken = parseFacebookAccessTokenFromUrl();
    if (!accessToken) {
      return;
    }

    processedRef.current = true;
    sessionStorage.removeItem('fb_oauth_pending');
    clearFacebookOAuthHash();

    void (async () => {
      try {
        const data = await authService.loginWithFacebook(accessToken);
        if (!data?.user) {
          navigate('/login', { replace: true });
          return;
        }
        login(data.user as User);
        navigate(getPostLoginPath((data.user as User).role), { replace: true });
      } catch {
        navigate('/login', { replace: true });
      }
    })();
  }, [login, navigate]);

  return null;
}
