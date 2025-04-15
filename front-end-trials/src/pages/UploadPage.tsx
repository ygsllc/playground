import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Text,
  VStack,
  useToast,
  useColorModeValue,
  Progress,
  HStack,
  Avatar,
} from '@chakra-ui/react';
import {
  FiUploadCloud,
  FiFilePlus,
  FiCloud,
  FiFileText,
  FiFile,
  FiFileImage,
  FiFilePdf,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi';

const ACCEPTED_EXTENSIONS = [
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.jpg', '.jpeg'
];

const fileIcon = (name: string) => {
  if (name.match(/\.(pdf)$/i)) return <FiFilePdf color="#e53e3e" />;
  if (name.match(/\.(doc|docx)$/i)) return <FiFileText color="#3182ce" />;
  if (name.match(/\.(xls|xlsx)$/i)) return <FiFile color="#38a169" />;
  if (name.match(/\.(ppt|pptx)$/i)) return <FiFile color="#d69e2e" />;
  if (name.match(/\.(jpg|jpeg)$/i)) return <FiFileImage color="#dd6b20" />;
  return <FiFile />;
};

export const UploadPage: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ [name: string]: number }>({});
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const bg = useColorModeValue('rgba(255,255,255,0.85)', 'rgba(26,32,44,0.85)');
  const borderColor = dragActive ? 'pink.400' : useColorModeValue('gray.200', 'gray.700');

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const validFiles = Array.from(files).filter(file =>
      ACCEPTED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext))
    );
    setSelectedFiles(prev => [...prev, ...validFiles]);
    if (files.length && !validFiles.length) {
      toast({
        title: 'Invalid file type',
        description: 'Only PDF, Word, Excel, PowerPoint, and JPG files are allowed.',
        status: 'warning',
        duration: 4000,
      });
    }
  };

  const handleRemove = (name: string) => {
    setSelectedFiles(files => files.filter(f => f.name !== name));
    setProgress(p => {
      const { [name]: _, ...rest } = p;
      return rest;
    });
  };

  const handleUpload = async () => {
    setUploading(true);
    let prog: { [name: string]: number } = {};
    for (const file of selectedFiles) {
      prog[file.name] = 0;
    }
    setProgress({ ...prog });
    for (const file of selectedFiles) {
      for (let i = 1; i <= 100; i += 10) {
        await new Promise(res => setTimeout(res, 40));
        setProgress(p => ({ ...p, [file.name]: i }));
      }
    }
    setUploading(false);
    setSelectedFiles([]);
    setProgress({});
    toast({
      title: 'Upload complete',
      description: 'Your files have been uploaded (mock).',
      status: 'success',
      duration: 3000,
    });
  };

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  // Placeholder for Google Drive/OneDrive integration
  const handleDrive = (provider: 'google' | 'onedrive') => {
    toast({
      title: provider === 'google' ? 'Google Drive' : 'OneDrive',
      description: 'Drive integration is not implemented in this demo.',
      status: 'info',
      duration: 3000,
    });
  };

  return (
    <Flex minH="80vh" align="center" justify="center" bgGradient="linear(to-br, blue.900, pink.400)">
      <Box
        bg={bg}
        p={10}
        rounded="2xl"
        boxShadow="2xl"
        minW="350px"
        maxW="480px"
        w="100%"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <VStack spacing={6}>
          <Heading size="lg" color="blue.500" letterSpacing="wide">
            Upload Documents
          </Heading>
          <Text color="gray.400" textAlign="center">
            Upload PDF, Word, Excel, PowerPoint, or JPG files from your computer, Google Drive, or OneDrive.
          </Text>
          <Box
            w="100%"
            borderWidth="2px"
            borderStyle={dragActive ? 'dashed' : 'solid'}
            borderColor={borderColor}
            rounded="lg"
            bg={dragActive ? 'pink.50' : 'whiteAlpha.300'}
            p={6}
            textAlign="center"
            cursor="pointer"
            transition="all 0.2s"
            position="relative"
            onClick={() => inputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            _hover={{ borderColor: 'pink.400', bg: 'pink.50' }}
          >
            <VStack spacing={2}>
              <FiUploadCloud size={36} color="#ed64a6" />
              <Text fontWeight="bold" color="pink.400">Drag and drop files here</Text>
              <Text fontSize="sm" color="gray.400">or click to select files</Text>
            </VStack>
            <Input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_EXTENSIONS.join(',')}
              multiple
              hidden
              onChange={e => handleFiles(e.target.files)}
            />
          </Box>
          <Flex gap={2} w="100%" justify="center">
            <IconButton
              aria-label="Upload from Google Drive"
              icon={<FiCloud />}
              colorScheme="blue"
              variant="outline"
              onClick={() => handleDrive('google')}
            />
            <IconButton
              aria-label="Upload from OneDrive"
              icon={<FiCloud />}
              colorScheme="teal"
              variant="outline"
              onClick={() => handleDrive('onedrive')}
            />
          </Flex>
          {selectedFiles.length > 0 && (
            <Box w="100%" bg="gray.50" rounded="md" p={3} border="1px solid" borderColor="gray.200">
              <Text fontWeight="bold" mb={1} color="gray.600">Selected Files:</Text>
              <VStack align="start" spacing={2} maxH="160px" overflowY="auto">
                {selectedFiles.map(file => (
                  <HStack key={file.name} w="100%" justify="space-between" align="center">
                    <HStack>
                      {fileIcon(file.name)}
                      <Text fontSize="sm" color="blue.700" noOfLines={1} maxW="160px">{file.name}</Text>
                    </HStack>
                    <Flex align="center" gap={2}>
                      {uploading && (
                        <Progress w="80px" h={2} colorScheme="pink" rounded="md" value={progress[file.name] || 0} />
                      )}
                      {!uploading && (
                        <IconButton
                          aria-label="Remove file"
                          icon={<FiTrash2 />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleRemove(file.name)}
                        />
                      )}
                      {uploading && progress[file.name] === 100 && (
                        <FiCheckCircle color="#38a169" />
                      )}
                    </Flex>
                  </HStack>
                ))}
              </VStack>
            </Box>
          )}
          <Button
            leftIcon={<FiFilePlus />}
            colorScheme="blue"
            size="md"
            w="100%"
            isLoading={uploading}
            isDisabled={!selectedFiles.length || uploading}
            onClick={handleUpload}
            _hover={{ bg: 'blue.600', color: 'white', transform: 'scale(1.02)' }}
            rounded="lg"
            fontWeight="bold"
            fontSize="lg"
          >
            Upload
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};
