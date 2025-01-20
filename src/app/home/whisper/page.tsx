'use client';

import {
  Button,
  Input,
  Label,
  Link,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui';
import { useState } from 'react';
import openai from '@/lib/openai';
import { LoadingSVG } from '@/components/svgs/LoadingSVG';
import { ArrowUpRight, XCircle, UploadCloud } from 'lucide-react';

const models = [{ name: 'whisper-1' }, { name: 'whisper-2' }];

const WhisperTranscription = () => {
  const [selectedModel, setSelectedModel] = useState<string>(models[0].name);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [pending, setPending] = useState<boolean>(false);
  const [responseFormat, setResponseFormat] = useState<string>('text'); // Added option for response format
  const [prompt, setPrompt] = useState<string>(''); // Added option for user prompt

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setAudioFile(file);
  };

  const handleTranscribe = () => {
    if (!audioFile) {
      setErrorMessage('Please upload an audio file.');
      return;
    }

    setPending(true);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', selectedModel);

    fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openai.apiKey}`, // Replace with your key
      },
      body: formData,
    })
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error.message || 'Transcription failed.');
        }
        return response.json();
      })
      .then((data) => {
        setTranscription(data.text);
      })
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setPending(false);
      });
  };

  return (
    <div className="h-full w-full flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4">
        <Label>Model</Label>
        <Select
          name="model"
          value={selectedModel}
          onValueChange={setSelectedModel}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model, index) => (
              <SelectItem key={index} value={model.name}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-4">
        <Label>Response Format</Label>
        <Select
          name="response_format"
          value={responseFormat}
          onValueChange={setResponseFormat}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a response format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="verbose_json">Verbose JSON</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-4">
        <Label>Upload Audio File</Label>
        <Button variant="secondary" asChild>
          <Label
            htmlFor="audioFileInput"
            className="cursor-pointer flex items-center gap-2"
          >
            <UploadCloud size={18} />{' '}
            {audioFile ? audioFile.name : 'Select an audio file'}
          </Label>
        </Button>
        <Input
          id="audioFileInput"
          type="file"
          className="hidden"
          accept="audio/*"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex flex-col gap-4">
        <Label>Prompt (Optional)</Label>
        <Input
          type="text"
          placeholder="Enter a custom prompt to guide transcription"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleTranscribe} disabled={pending}>
          Transcribe
        </Button>
      </div>

      {pending && (
        <div className="flex justify-center">
          <LoadingSVG />
        </div>
      )}

      {errorMessage && (
        <div className="text-red-500 flex items-center gap-2">
          <XCircle size={18} />
          {errorMessage}
        </div>
      )}

      {transcription && (
        <div className="flex flex-col gap-4">
          <Label>Transcription</Label>
          <Textarea
            className="p-3 border rounded-md w-full h-40 resize-none overflow-auto"
            value={transcription}
            readOnly
          />
        </div>
      )}

      <Link
        href="https://platform.openai.com/docs/guides/whisper"
        target="_blank"
        className="flex items-center gap-1 mt-4"
      >
        Learn more about Whisper <ArrowUpRight size={16} />
      </Link>
    </div>
  );
};

export default WhisperTranscription;
