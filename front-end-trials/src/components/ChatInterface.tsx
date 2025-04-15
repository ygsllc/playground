import React, { useRef, useEffect, useState } from 'react'
import {
  Box,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Flex,
  Heading,
  Text,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react'
import { FiArrowDown } from 'react-icons/fi'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { useChatContext } from '../context/ChatContext'
import { ErrorBoundary } from 'react-error-boundary'
import { format } from 'date-fns'
import { BackendStatus } from './BackendStatus'

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <Alert
      status="error"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="200px"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        Something went wrong
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        {error.message}
      </AlertDescription>
      <Button onClick={resetErrorBoundary} mt={4}>
        Try again
      </Button>
    </Alert>
  )
}

export const ChatInterface: React.FC = () => {
  const { messages, isLoading, error, sendMessage, clearChat, retryLastMessage } = useChatContext()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const headerBgColor = useColorModeValue('gray.50', 'gray.700')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const groupMessagesByDate = () => {
    const groups: { [key: string]: typeof messages } = {}
    messages.forEach(message => {
      const date = format(new Date(message.timestamp), 'MMMM d, yyyy')
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    return groups
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        clearChat()
      }}
    >
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        height="600px"
        display="flex"
        flexDirection="column"
        bg={bgColor}
        boxShadow="lg"
      >
        <Flex
          p={4}
          borderBottomWidth="1px"
          borderColor={borderColor}
          bg={headerBgColor}
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading size="md" color="blue.600">RAG Chat Assistant</Heading>
          <BackendStatus />
        </Flex>

        <Flex
          ref={chatContainerRef}
          flex="1"
          overflowY="auto"
          p={4}
          flexDirection="column"
          onScroll={handleScroll}
          position="relative"
        >
          {messages.length === 0 ? (
            <Flex
              flex="1"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              p={8}
            >
              <VStack spacing={4}>
                <Heading size="lg" color="blue.600">Welcome to ChatBot Testing</Heading>
                <Text color="gray.600" maxW="md">
                  I'm your AI assistant powered by....magic
                </Text>
              </VStack>
            </Flex>
          ) : (
            <VStack spacing={6} align="stretch">
              {Object.entries(groupMessagesByDate()).map(([date, dateMessages]) => (
                <Box key={date}>
                  <Text
                    fontSize="sm"
                    color="gray.500"
                    textAlign="center"
                    my={4}
                    px={2}
                    bg={headerBgColor}
                    borderRadius="md"
                    display="inline-block"
                  >
                    {date}
                  </Text>
                  <VStack spacing={4} align="stretch">
                    {dateMessages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                  </VStack>
                </Box>
              ))}
            </VStack>
          )}
          {error && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              <AlertTitle>Error:</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
              <Button
                size="sm"
                ml={4}
                onClick={retryLastMessage}
                isLoading={isLoading}
              >
                Retry
              </Button>
            </Alert>
          )}
          <div ref={messagesEndRef} />
        </Flex>

        {showScrollButton && (
          <IconButton
            aria-label="Scroll to bottom"
            icon={<FiArrowDown />}
            position="absolute"
            bottom="80px"
            right="20px"
            onClick={scrollToBottom}
            colorScheme="blue"
            borderRadius="full"
            boxShadow="md"
          />
        )}

        <ChatInput
          onSend={sendMessage}
          onClear={clearChat}
          isLoading={isLoading}
        />
      </Box>
    </ErrorBoundary>
  )
} 