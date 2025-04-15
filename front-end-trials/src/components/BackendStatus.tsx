import React, { useEffect, useState } from 'react';
import { Flex, Text, Icon, Button, Tooltip } from '@chakra-ui/react';
import { FiCircle } from 'react-icons/fi';
import { checkHealth } from '../services/api';

export const BackendStatus: React.FC = () => {
  const [status, setStatus] = useState<'unknown' | 'up' | 'down' | 'checking'>('checking');
  const [waking, setWaking] = useState(false);

  const checkBackend = async () => {
    setStatus('checking');
    const healthy = await checkHealth();
    setStatus(healthy ? 'up' : 'down');
  };

  useEffect(() => {
    checkBackend();
    // Optionally poll every 60 seconds
    const interval = setInterval(checkBackend, 60000);
    return () => clearInterval(interval);
  }, []);

  // Simulate a wake-up call (could be a ping or custom endpoint)
  const wakeUpBackend = async () => {
    setWaking(true);
    await checkBackend();
    setWaking(false);
  };

  return (
    <Flex align="center" gap={2}>
      <Tooltip label={status === 'up' ? 'Backend is online' : status === 'down' ? 'Backend is offline' : 'Checking backend...'}>
        <Flex align="center">
          <Icon as={FiCircle} color={status === 'up' ? 'green.400' : status === 'down' ? 'red.400' : 'yellow.400'} boxSize={4} mr={1} />
          <Text fontSize="sm" color={status === 'up' ? 'green.300' : status === 'down' ? 'red.300' : 'yellow.300'}>
            {status === 'up' ? 'Backend: Online' : status === 'down' ? 'Backend: Offline' : 'Backend: Checking...'}
          </Text>
        </Flex>
      </Tooltip>
      {status !== 'up' && (
        <Button size="xs" colorScheme="blue" variant="outline" onClick={wakeUpBackend} isLoading={waking}>
          Wake up Render
        </Button>
      )}
    </Flex>
  );
};
