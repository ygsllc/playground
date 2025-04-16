import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Flex,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react';
import { IoSend } from 'react-icons/io5';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatBox: React.FC = () => {
  console.log('ChatBox component rendering');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    console.log('ChatBox mounted');
    return () => console.log('ChatBox unmounted');
  }, []);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const userMessageBg = useColorModeValue('blue.100', 'blue.900');
  const botMessageBg = useColorModeValue('gray.100', 'gray.700');

  const handleSendMessage = () => {
    console.log('Sending message:', inputMessage);
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');

    // TODO: Add API call here later
    // For now, just simulate a bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "This is a simulated response. The actual API integration will be implemented later.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  console.log('Current messages:', messages);

  return (
    <Box
      w="100%"
      h="100%"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      borderColor={borderColor}
    >
      <VStack h="100%" spacing={0}>
        {/* Messages Container */}
        <Flex
          flex={1}
          w="100%"
          overflowY="auto"
          p={4}
          direction="column"
          gap={4}
        >
          {messages.map((message) => (
            <Flex
              key={message.id}
              justify={message.isUser ? 'flex-end' : 'flex-start'}
              w="100%"
              mb={4}
            >
              <Box
                maxW="70%"
                bg={message.isUser ? userMessageBg : botMessageBg}
                p={3}
                borderRadius="lg"
                boxShadow="sm"
              >
                <Text>{message.text}</Text>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {message.timestamp.toLocaleTimeString()}
                </Text>
              </Box>
            </Flex>
          ))}
        </Flex>

        {/* Input Area */}
        <Box w="100%" p={4} borderTopWidth="1px" borderColor={borderColor}>
          <HStack>
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              size="md"
            />
            <IconButton
              aria-label="Send message"
              icon={<IoSend />}
              onClick={handleSendMessage}
              colorScheme="blue"
              isDisabled={!inputMessage.trim()}
            />
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
}; 