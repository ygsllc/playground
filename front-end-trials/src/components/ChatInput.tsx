import React, { useState, useRef, KeyboardEvent } from 'react'
import {
  HStack,
  Input,
  Button,
  Text,
  useToast,
  IconButton,
  Tooltip,
  useColorModeValue,
  Box,
  Progress,
} from '@chakra-ui/react'
import { FiTrash2 } from 'react-icons/fi'

interface ChatInputProps {
  onSend: (message: string) => Promise<void>
  onClear: () => void
  isLoading: boolean
}

const MAX_LENGTH = Number(import.meta.env.VITE_MAX_MESSAGE_LENGTH) || 2000
const WARNING_THRESHOLD = 0.8 // 80% of max length

export function ChatInput({ onSend, onClear, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const bgColor = useColorModeValue('white', 'gray.800')
  const progressColor = useColorModeValue('blue.500', 'blue.300')
  const warningColor = useColorModeValue('orange.500', 'orange.300')
  const errorColor = useColorModeValue('red.500', 'red.300')

  const handleSend = async () => {
    const trimmedInput = input.trim()
    if (!trimmedInput) {
      toast({
        title: 'Empty message',
        description: 'Please enter a message to send',
        status: 'warning',
        duration: 3000,
      })
      return
    }

    try {
      await onSend(trimmedInput)
      setInput('')
      inputRef.current?.focus()
    } catch (error) {
      // Error handling is done in the parent component
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const characterCount = input.length
  const isOverLimit = characterCount > MAX_LENGTH
  const progress = characterCount / MAX_LENGTH
  const showWarning = progress >= WARNING_THRESHOLD && !isOverLimit

  return (
    <Box borderTopWidth="1px" borderColor={borderColor} bg={bgColor}>
      <Box px={4} py={2}>
        <Progress
          value={Math.min(progress * 100, 100)}
          colorScheme={isOverLimit ? 'red' : showWarning ? 'orange' : 'blue'}
          size="xs"
          borderRadius="full"
          mb={2}
        />
        <HStack spacing={2}>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            isInvalid={isOverLimit}
            disabled={isLoading}
            _disabled={{ opacity: 0.7, cursor: 'not-allowed' }}
            size="lg"
          />
          <Text
            fontSize="sm"
            color={isOverLimit ? errorColor : showWarning ? warningColor : 'gray.500'}
            minW="4.5rem"
            textAlign="right"
          >
            {characterCount}/{MAX_LENGTH}
          </Text>
          <Tooltip label="Send message">
            <Button
              aria-label="Send message"
              colorScheme="blue"
              onClick={handleSend}
              isLoading={isLoading}
              isDisabled={isOverLimit || !input.trim()}
              size="lg"
              px={6}
              fontWeight="bold"
            >
              Send
            </Button>
          </Tooltip>
          <Tooltip label="Clear chat">
            <IconButton
              aria-label="Clear chat"
              icon={<FiTrash2 />}
              variant="ghost"
              onClick={onClear}
              isDisabled={isLoading}
              size="lg"
            />
          </Tooltip>
        </HStack>
      </Box>
    </Box>
  )
} 