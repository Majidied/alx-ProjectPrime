import { useQuery } from '@tanstack/react-query';
import { fetchVerificationStatus } from '../api/userApi';

const useVerification = () => {

  const { data: isVerified, isLoading, isError } = useQuery({
    queryKey: ['verificationStatus'],
    queryFn: fetchVerificationStatus,
    retry: false, // Do not retry on failure
    refetchOnWindowFocus: true, // Refetch data when window regains focus
  });

  return { isVerified, isLoading, isError };
};

export default useVerification;