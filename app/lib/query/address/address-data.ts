import { useQuery } from '@tanstack/react-query';

const fetchUserAddress = async () => {
  const response = await fetch('/api/user/address');
  
  if (!response.ok) {
    if (response.status === 404) {
      console.log('No address found');
      return null;
    }
    throw new Error('Failed to fetch address');
  }
  
  const data = await response.json();
  return data.address;
};

export const useUserAddress = () => {
  return useQuery({
    queryKey: ['user-address'],
    queryFn: fetchUserAddress,
    retry: 1,
  });
};