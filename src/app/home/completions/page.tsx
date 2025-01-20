'use client';

import { useState } from 'react';
import cl100k_base from 'gpt-tokenizer';
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
  { name: 'davinci-002' },
  { name: 'babbage-002' },
];

const Completions = () => {
  const [text, setText] = useState<string>('');
  const [tokenCount, setTokenCount] = useState<number>(0);
  const [pendingCompletion, setPendingCompletion] = useState<boolean>(false);
  const [options, setOptions] = useState<{
    model: string;
    temperature: number;
    maxTokens: number;
    frequencyPenalty: number;
    presencePenalty: number;
  }>({
    model: models[1].name,
    temperature: 0.9,
    maxTokens: 200,
    frequencyPenalty: 0.45,
    presencePenalty: 0.45,
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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    setText(inputText);

    // Tokenize text and update token count
    const encodedTokens = cl100k_base.encode(inputText);
    setTokenCount(encodedTokens.length);
  };

  const handleNumberInputChange = (
    value: number,
    field: 'temperature' | 'maxTokens'
  ) => {
    const constraints = {
      temperature: { min: 0, max: 2 },
      maxTokens: { min: 1, max: 4096 },
    };

    const clampedValue = Math.min(
      Math.max(value, constraints[field].min),
      constraints[field].max
    );

    setOptions({ ...options, [field]: clampedValue });
  };

  return (
    <div className="h-full w-full flex overflow-hidden px-4 py-6 gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <div className="relative flex-1 flex flex-col gap-4">
          <Textarea
            name="text"
            className="flex-1 resize-none h-full"
            placeholder="Write a tagline for an ice cream shop."
            value={text}
            onChange={handleTextChange}
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <div className="absolute bottom-2 right-2 text-gray-500 text-sm">
            Tokens: {tokenCount}
          </div>
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
        <div className="flex flex-col gap-2">
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
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <Slider
                name="temperature"
                value={[options.temperature]}
                max={2}
                step={0.01}
                onValueChange={(value) =>
                  handleNumberInputChange(value[0], 'temperature')
                }
              />
            </div>
            <Input
              type="number"
              min={0}
              max={2}
              step={0.01}
              className="w-20"
              value={options.temperature}
              onChange={(e) =>
                handleNumberInputChange(
                  parseFloat(e.target.value),
                  'temperature'
                )
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label>Max Tokens</Label>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <Slider
                name="maxTokens"
                value={[options.maxTokens]}
                min={1}
                max={4096}
                step={1}
                onValueChange={(value) =>
                  handleNumberInputChange(value[0], 'maxTokens')
                }
              />
            </div>
            <Input
              type="number"
              min={1}
              max={4096}
              className="w-20"
              value={options.maxTokens}
              onChange={(e) =>
                handleNumberInputChange(parseInt(e.target.value), 'maxTokens')
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label>Frequency Penalty</Label>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
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
            <Input
              type="number"
              min={0}
              max={2}
              step={0.01}
              className="w-20"
              value={options.frequencyPenalty}
              onChange={(e) =>
                setOptions({
                  ...options,
                  frequencyPenalty: parseFloat(e.target.value),
                })
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label>Presence Penalty</Label>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
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
            <Input
              type="number"
              min={0}
              max={2}
              step={0.01}
              className="w-20"
              value={options.presencePenalty}
              onChange={(e) =>
                setOptions({
                  ...options,
                  presencePenalty: parseFloat(e.target.value),
                })
              }
            />
          </div>
        </div>
        <a
          href="https://platform.openai.com/docs/guides/completions"
          target="_blank"
          className="flex items-center gap-1"
        >
          Learn more about text generation <ArrowUpRight size={16} />
        </a>
      </div>
    </div>
  );
};

export default Completions;
