const FACEBOOK_SDK_VERSION = 'v21.0';
const FACEBOOK_SCOPE = 'public_profile,email';

let googleInitClientId: string | null = null;
let facebookSdkPromise: Promise<void> | null = null;

/** Redirect URI đăng ký trên Facebook Developer (Valid OAuth Redirect URIs). */
export function getFacebookRedirectUri(): string {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${window.location.origin}${normalizedBase}`;
}

export function buildFacebookOAuthUrl(appId: string): string {
  const redirectUri = encodeURIComponent(getFacebookRedirectUri());
  const scope = encodeURIComponent(FACEBOOK_SCOPE);
  return (
    `https://www.facebook.com/${FACEBOOK_SDK_VERSION}/dialog/oauth` +
    `?client_id=${encodeURIComponent(appId)}` +
    `&redirect_uri=${redirectUri}` +
    `&scope=${scope}` +
    `&response_type=token`
  );
}

/** Facebook implicit grant trả token trong hash: #access_token=... */
export function parseFacebookAccessTokenFromUrl(): string | null {
  const rawHash = window.location.hash;
  if (!rawHash || !rawHash.includes('access_token=')) {
    return null;
  }

  const queryPart = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash;
  if (queryPart.startsWith('/')) {
    return null;
  }

  const params = new URLSearchParams(queryPart);
  return params.get('access_token');
}

export function clearFacebookOAuthHash(): void {
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
}

/** FB.login popup chỉ hoạt động trên HTTPS; localhost HTTP phải dùng redirect. */
export function shouldUseFacebookRedirect(): boolean {
  return window.location.protocol !== 'https:';
}

export function loadFacebookSdk(appId: string): Promise<void> {
  if (window.FB) {
    return Promise.resolve();
  }

  if (!facebookSdkPromise) {
    facebookSdkPromise = new Promise((resolve, reject) => {
      window.fbAsyncInit = () => {
        try {
          window.FB?.init({
            appId,
            cookie: true,
            xfbml: false,
            version: FACEBOOK_SDK_VERSION,
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      if (document.getElementById('facebook-jssdk')) {
        return;
      }

      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/vi_VN/sdk.js';
      script.async = true;
      script.defer = true;
      script.onerror = () => reject(new Error('Không tải được Facebook SDK'));
      document.body.appendChild(script);
    });
  }

  return facebookSdkPromise;
}

type FacebookLoginHandlers = {
  onSuccess: (accessToken: string) => void;
  onError: (message: string) => void;
  onCancel: () => void;
};

/** Callback phải là function thường — FB SDK không chấp nhận async function. */
export function loginWithFacebookPopup(handlers: FacebookLoginHandlers): void {
  if (!window.FB) {
    handlers.onError('Facebook SDK chưa sẵn sàng, vui lòng thử lại sau giây lát.');
    return;
  }

  try {
    window.FB.login((response) => {
      if (response.authResponse?.accessToken) {
        handlers.onSuccess(response.authResponse.accessToken);
        return;
      }
      handlers.onCancel();
    }, { scope: FACEBOOK_SCOPE });
  } catch {
    handlers.onError(
      'Facebook Login không hỗ trợ HTTP. Hãy dùng chế độ redirect hoặc chạy dev server bằng HTTPS.',
    );
  }
}

export function initGoogleSignIn(
  clientId: string,
  onCredential: (credential: string) => void,
  buttonContainer: HTMLElement | null,
): void {
  if (!window.google?.accounts?.id || !buttonContainer) {
    return;
  }

  const renderButton = () => {
    buttonContainer.replaceChildren();
    window.google!.accounts.id.renderButton(buttonContainer, {
      theme: 'outline',
      size: 'large',
      width: 280,
    });
  };

  if (googleInitClientId !== clientId) {
    googleInitClientId = clientId;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => onCredential(response.credential),
    });
  }

  renderButton();
}

export function triggerGoogleButton(container: HTMLElement | null): void {
  container?.querySelector<HTMLElement>('div[role="button"]')?.click();
}
