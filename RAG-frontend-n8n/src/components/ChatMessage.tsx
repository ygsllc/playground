import React from 'react'
import { Box, Text, Flex, Icon, Tooltip, useColorModeValue } from '@chakra-ui/react'
import { Message } from '../types/chat'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi'

interface ChatMessageProps {
  message: Message
}

const statusIcons = {
  sending: { icon: FiClock, color: 'gray.500', label: 'Sending...' },
  sent: { icon: FiCheck, color: 'green.500', label: 'Sent' },
  error: { icon: FiAlertCircle, color: 'red.500', label: 'Error sending message' },
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const status = message.status && statusIcons[message.status]

  const bubbleBgColor = useColorModeValue(
    isUser ? 'blue.500' : 'gray.100',
    isUser ? 'blue.500' : 'gray.700'
  )
  const textColor = useColorModeValue(
    isUser ? 'white' : 'gray.800',
    isUser ? 'white' : 'white'
  )
  const timestampColor = useColorModeValue(
    isUser ? 'whiteAlpha.800' : 'gray.500',
    isUser ? 'whiteAlpha.800' : 'gray.400'
  )

  return (
    <Box
      alignSelf={isUser ? 'flex-end' : 'flex-start'}
      maxW="85%"
      mb={1}
      position="relative"
    >
      <Flex
        direction="column"
        bg={bubbleBgColor}
        color={textColor}
        px={3}
        py={1}
        borderRadius="lg"
        boxShadow="sm"
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          top: '50%',
          [isUser ? 'right' : 'left']: '-6px',
          width: '0',
          height: '0',
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          [isUser ? 'borderLeft' : 'borderRight']: `6px solid ${bubbleBgColor}`,
          transform: 'translateY(-50%)',
        }}
      >
        <Box className="markdown-content" fontSize="sm" lineHeight="short" pb={4}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </Box>
        <Flex 
          justify="flex-end" 
          align="center"
          mt={0.5}
          fontSize="xs"
          opacity={0.8}
          position="absolute"
          bottom={1}
          right={3}
        >
          <Text 
            color={timestampColor} 
            mr={1} 
            fontSize="2xs"
            fontStyle="italic"
          >
            {format(new Date(message.timestamp), 'HH:mm')}
          </Text>
          {status && (
            <Tooltip label={status.label}>
              <span>
                <Icon as={status.icon} color={status.color} boxSize="8px" />
              </span>
            </Tooltip>
          )}
        </Flex>
      </Flex>
    </Box>
  )
} 