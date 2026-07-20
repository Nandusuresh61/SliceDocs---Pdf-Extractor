import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { APP_ROUTES, API_ROUTES } from '../../constants/routes';

export default function GoogleLoginButton() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        try {
          const { credential } = credentialResponse;
          
          if (!credential) {
            toast.error('Google login failed: No credential received');
            return;
          }

          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}${API_ROUTES.AUTH.GOOGLE}`,
            { idToken: credential },
            { withCredentials: true }
          );

          if (response.data.success) {
            login(response.data.data);
            toast.success('Successfully logged in');
            navigate(APP_ROUTES.HOME);
          }
        } catch (error) {
          console.error(error);
          toast.error('Failed to authenticate with server');
        }
      }}
      onError={() => {
        toast.error('Google Login Failed');
      }}
      useOneTap
    />
  );
}
