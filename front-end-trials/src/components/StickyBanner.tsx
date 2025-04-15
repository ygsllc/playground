import React from 'react';
import { Box, Flex, Link, useColorModeValue, chakra } from '@chakra-ui/react';
import { FiHome, FiUploadCloud, FiBookOpen, FiCloud } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

const links = [
  { label: 'Home', href: '/', icon: FiHome },
  { label: 'Upload Files', href: '/upload', icon: FiUploadCloud },
  { label: 'Docs', href: '/docs', icon: FiBookOpen },
];

export const StickyBanner: React.FC = () => {
  // Vibrant, fintech-inspired gradient and contrasting text
  const bg = 'linear-gradient(90deg, #0f2027 0%, #2c5364 50%, #ff6b6b 100%)';
  const linkColor = useColorModeValue('white', 'yellow.200');
  const linkHover = useColorModeValue('yellow.300', 'white');

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      width="100%"
      zIndex={1000}
      bg={bg}
      borderBottomWidth="0px"
      boxShadow="0 2px 12px 0 rgba(0,0,0,0.14)"
      py={1}
    >
      <Flex
        maxW="container.xl"
        mx="auto"
        px={6}
        py={2}
        align="center"
        justify="flex-end"
        gap={6}
      >
        {links.map(({ label, href, icon: Icon }) => (
          <Link
            as={RouterLink}
            key={label}
            to={href}
            display="flex"
            alignItems="center"
            fontWeight="bold"
            color={linkColor}
            fontSize="lg"
            letterSpacing="wide"
            _hover={{ color: linkHover, textDecoration: 'none', transform: 'scale(1.08)' }}
            transition="all 0.2s"
            px={3}
            py={1}
            borderRadius="md"
            bg="rgba(255,255,255,0.05)"
            _active={{ bg: 'whiteAlpha.300' }}
          >
            <chakra.span mr={2} display="flex" alignItems="center">
              <Icon />
            </chakra.span>
            {label}
          </Link>
        ))}
      </Flex>
    </Box>
  );
};
