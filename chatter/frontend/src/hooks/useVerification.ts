import { isVerifiedUser } from "../utils/User";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook to verify if a user is verified.
 *
 * @returns A boolean value indicating if the user is verified.
 */
const useVerification = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const response = await isVerifiedUser();

        if (!response) {
          navigate('/verify');
        }
      } catch (error) {
        console.error('Error checking verification:', error);
      }
    };

    checkVerification();
  }, [navigate]);
}

export default useVerification;
