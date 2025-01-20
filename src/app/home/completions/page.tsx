'use client';

import { useState } from 'react';
import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Text,
  Textarea,
} from '@/components/ui';
import openai from '@/lib/openai';
import { ArrowUpRight, Send, XCircle } from 'lucide-react';
import { Input } from '@/components/ui';

const models = [
  { name: 'gpt-3.5-turbo-instruct' },
  { name: 'babbage-002' },
  { name: 'davinci-002' },
];

const Completions = () => {
  const [text, setText] = useState<string>('');
  const [pendingCompletion, setPendingCompletion] = useState<boolean>(false);
  const [options, setOptions] = useState<{
    model: string;
    temperature: number;
    maxTokens: number;
    frequencyPenalty: number;
    presencePenalty: number;
  }>({
    model: models[0].name,
    temperature: 1,
    maxTokens: 100,
    frequencyPenalty: 0,
    presencePenalty: 0,
  });
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSend = () => {
    setPendingCompletion(true);
    openai.completions
      .create({
        model: options.model,
        prompt: text,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        frequency_penalty: options.frequencyPenalty,
        presence_penalty: options.presencePenalty,
      })
      .then((response) => {
        const completionText = response.choices[0].text;
        setText((prevText) => `${prevText}${completionText}`);
      })
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setPendingCompletion(false);
      });
  };

  return (
    <div className="h-full w-full flex overflow-hidden px-4 py-6 gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <Textarea
            name="text"
            className="flex-1 resize-none h-full"
            placeholder="Enter your text or prompt here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault(); // Prevents new line insertion
                handleSend();
              }
            }}
          />
          {pendingCompletion && <Text>Loading...</Text>}
          {errorMessage && (
            <div className="flex items-center gap-2 text-red-500">
              <XCircle />
              <Text>{errorMessage}</Text>
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <Button onClick={handleSend} disabled={pendingCompletion}>
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
        <div className="flex flex-col gap-3">
          <Label>Temperature</Label>
          <div className="flex justify-between">
            <Text>Temperature</Text>
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
            name="maxTokens"
            type="number"
            min={1}
            max={4096}
            placeholder="Max Tokens"
            value={options.maxTokens}
            onChange={(e) =>
              setOptions({ ...options, maxTokens: Number(e.target.value) })
            }
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label>Frequency Penalty</Label>
          <div className="flex justify-between">
            <Text>Frequency Penalty</Text>
            <Text variant="medium">{options.frequencyPenalty}</Text>
          </div>
          <Slider
            name="frequencyPenalty"
            value={[options.frequencyPenalty]}
            max={2}
            step={0.01}
            onValueChange={(value) =>
              setOptions({ ...options, frequencyPenalty: value[0] })
            }
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label>Presence Penalty</Label>
          <div className="flex justify-between">
            <Text>Presence Penalty</Text>
            <Text variant="medium">{options.presencePenalty}</Text>
          </div>
          <Slider
            name="presencePenalty"
            value={[options.presencePenalty]}
            max={2}
            step={0.01}
            onValueChange={(value) =>
              setOptions({ ...options, presencePenalty: value[0] })
            }
          />
        </div>
        <a
          href="https://platform.openai.com/docs/guides/completions"
          target="_blank"
          className="text-blue-500 flex items-center gap-1"
        >
          Learn more about text generation <ArrowUpRight size={16} />
        </a>
      </div>
    </div>
  );
};

export default Completions;
