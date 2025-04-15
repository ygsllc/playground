import React from 'react'
import { Box, Container, useColorModeValue } from '@chakra-ui/react'
import { ChatInterface } from './components/ChatInterface'
import { ChatProvider } from './context/ChatContext'
import { StickyBanner } from './components/StickyBanner'
import { UploadPage } from './pages/UploadPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Link as RouterLink } from 'react-router-dom'

const App: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  
  return (
    <Router>
      <StickyBanner />
      <Routes>
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/" element={
          <Box minH="100vh" bg={bgColor} py={8}>
            <Container maxW="container.md">
              <ChatProvider>
                <ChatInterface />
              </ChatProvider>
            </Container>
            <Box as="footer" py={4} textAlign="center" color="gray.400" fontSize="sm">
              Powered by Confer Solutions
            </Box>
          </Box>
        } />
      </Routes>
    </Router>
  )
}

export default App 