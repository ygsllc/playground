import React from 'react'
import { Box, Container, useColorModeValue } from '@chakra-ui/react'
import { ChatInterface } from './components/ChatInterface'
import { ChatProvider } from './context/ChatContext'

const App: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  
  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="container.md">
        <ChatProvider>
          <ChatInterface />
        </ChatProvider>
      </Container>
    </Box>
  )
}

export default App 