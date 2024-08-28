import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { isVerifiedUser } from "../utils/User";

/**
 * Custom hook to check if a user is verified and handle navigation based on verification status.
 *
 * @returns A boolean value indicating whether the user is verified (`true`) or not (`false`).
 */
const useVerification = () => {
  // State to hold the verification status of the user
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const navigate = useNavigate();

  /**
   * Function to check the user's verification status.
   * If the user is not verified, navigate to the verification page.
   */
  const checkVerification = useCallback(async () => {
    try {
      const response = await isVerifiedUser();

      if (!response) {
        // Navigate to the verification page if the user is not verified
        navigate('/verify');
      } else {
        // Update the verification status if the user is verified
        setIsVerified(true);
      }
    } catch (error) {
      console.error('Error checking verification:', error);
    }
  }, [navigate]);

  useEffect(() => {
    let isMounted = true; // Flag to check if the component is still mounted

    /**
     * Function to run the verification check if the component is mounted.
     */
    const runCheck = async () => {
      if (isMounted) {
        await checkVerification();
      }
    };

    // Run the verification check when the component mounts
    runCheck();

    // Cleanup function to run when the component unmounts
    return () => {
      isMounted = false; // Mark the component as unmounted
    };
  }, [checkVerification]);

  // Return the current verification status
  return isVerified;
};

export default useVerification;
