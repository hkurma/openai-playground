'use client';

import { LoadingSVG } from '@/components/svgs/LoadingSVG';
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
  Slider,
  Text,
  Textarea,
} from '@/components/ui';
import { DEFAULT_SYSTEM_INSTRUCTIONS } from '@/lib/constants';
import openai from '@/lib/openai';
import { cn } from '@/lib/utils';
import { ArrowUpRight, MessageSquare, Send, XCircle } from 'lucide-react';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const models = [
  { name: 'gpt-4.5' },
  { name: 'gpt-4o' },
  { name: 'gpt-4-turbo' },
  { name: 'gpt-3.5-turbo-1106' },
];

const TextGeneration = () => {
  const [systemInstructions, setSystemInstructions] = useState<string>('');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [pendingCompletion, setPendingCompletion] = useState<boolean>(false);
  const [options, setOptions] = useState<{
    model: string;
    temperature: number;
    maxtokens: number;
  }>({
    model: models[0].name,
    temperature: 1,
    maxtokens: 4096,
  });
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSend = () => {
    setPendingCompletion(true);
    const newMessages = [...messages];
    newMessages.push({
      role: 'user',
      content: inputMessage,
    });
    setMessages(newMessages);
    setInputMessage('');
    openai.chat.completions
      .create({
        model: options.model,
        messages: [
          {
            role: 'system',
            content: systemInstructions ?? DEFAULT_SYSTEM_INSTRUCTIONS,
          },
          ...newMessages,
        ],
        temperature: options.temperature,
        max_tokens: 4096,
      })
      .then((completionResponse) => {
        setMessages((prevMessages) => {
          return [
            ...prevMessages,
            { ...completionResponse.choices[0].message },
          ];
        });
      })
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setPendingCompletion(false);
      });
  };

  const handleInputMessageKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      handleSend();
      event.preventDefault();
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full w-full flex overflow-hidden px-4 py-6 gap-4">
      <div className="hidden lg:flex flex-col lg:w-1/4 xl:w-1/5 gap-6">
        <div className="flex-1 flex flex-col gap-3">
          <Label>System Message</Label>
          <Textarea
            name="systemMessage"
            className="h-full resize-none"
            placeholder={DEFAULT_SYSTEM_INSTRUCTIONS}
            onChange={(e) => setSystemInstructions(e.target.value)}
            value={systemInstructions}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1 flex flex-col gap-4 overflow-auto">
          {messages.length === 0 && (
            <div className="w-full h-full flex flex-col justify-center items-center gap-3">
              <MessageSquare />
              <Text variant="medium">Send a message to start your chat</Text>
            </div>
          )}
          {messages
            .filter((m) => m.role != 'system')
            .map((message, index) => (
              <Text
                key={index}
                className={cn(
                  'p-3 border rounded-md w-fit',
                  message.role === 'assistant' && 'bg-secondary',
                  message.role === 'user' && 'ml-auto'
                )}
              >
                <Markdown remarkPlugins={[remarkGfm]}>
                  {message.content as string}
                </Markdown>
              </Text>
            ))}
          {pendingCompletion && (
            <div className="p-3 border rounded w-fit bg-secondary">
              <LoadingSVG />
            </div>
          )}
          {errorMessage && (
            <div className="w-full h-full flex flex-col justify-center items-center gap-4 text-red-500">
              <XCircle />
              <Text className="">{errorMessage}</Text>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-4">
          <Input
            name="inputMessage"
            className="flex-1"
            placeholder="Enter your message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyUp={handleInputMessageKeyUp}
          />
          <Button onClick={handleSend}>
            <Send size={18} />
          </Button>
        </div>
      </div>
      <div className="hidden lg:flex flex-col lg:w-1/4 xl:w-1/5 gap-6">
        <div className="flex flex-col gap-3">
          <Label>Model</Label>
          <Select
            name="model"
            value={options.model}
            onValueChange={(value) => setOptions({ ...options, model: value })}
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
          <div className="flex justify-between">
            <Label>Temperature</Label>
            <Text variant="medium">{options.temperature}</Text>
          </div>
          <Slider
            name="temperature"
            value={[options.temperature]}
            max={2}
            step={0.01}
            onValueChange={(value) =>
              setOptions({ ...options, temperature: value[0] })
            }
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label>Max Tokens</Label>
          <Input
            name="maxtokens"
            type="number"
            min={0}
            max={4096}
            placeholder="Max Tokens"
            value={options.maxtokens}
            onChange={(e) =>
              setOptions({ ...options, maxtokens: Number(e.target.value) })
            }
          />
        </div>
        <Link
          href="https://platform.openai.com/docs/guides/text-generation"
          target="_blank"
        >
          Learn more about text generation <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default TextGeneration;
