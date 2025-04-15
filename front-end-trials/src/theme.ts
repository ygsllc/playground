import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    initialColorMode: 'dark', // Set default to dark mode
    useSystemColorMode: true, // Allow system preference
  },
  styles: {
    global: {
      body: {
        bg: 'linear-gradient(135deg, #1a237e 0%, #0d133d 100%)', // Blue gradient background
        color: 'gray.100',
      },
      '::-webkit-scrollbar': {
        width: '8px',
        background: '#1a237e',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#3949ab',
        borderRadius: '8px',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'blue',
      },
      baseStyle: {
        borderRadius: 'lg',
        fontWeight: 'bold',
        letterSpacing: '0.05em',
        boxShadow: 'md',
      },
    },
    Input: {
      baseStyle: {
        field: {
          bg: 'gray.900',
          color: 'gray.100',
          borderColor: 'blue.700',
          _placeholder: { color: 'gray.400' },
        },
      },
    },
    Box: {
      baseStyle: {
        bg: 'gray.800',
        borderRadius: 'lg',
      },
    },
  },
})

export default theme