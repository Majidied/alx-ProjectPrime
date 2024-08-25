import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { isVerifiedUser } from "../utils/User";

/**
 * Custom hook to verify if a user is verified.
 *
 * @returns A boolean value indicating if the user is verified.
 */
const useVerification = () => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const navigate = useNavigate();

  const checkVerification = useCallback(async () => {
    try {
      const response = await isVerifiedUser();

      if (!response) {
        navigate('/verify');
      } else {
        setIsVerified(true);
      }
    } catch (error) {
      console.error('Error checking verification:', error);
    }
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;

    const runCheck = async () => {
      if (isMounted) {
        await checkVerification();
      }
    };

    runCheck();

    return () => {
      isMounted = false;
    };
  }, [checkVerification]);

  return isVerified;
};

export default useVerification;
