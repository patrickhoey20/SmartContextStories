import { useEffect, useState } from 'react';

export async function ChatGPTCall(prompt) {
    const response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_GPT_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 100,
      }),
    })
    const data = await response.json();
    return data;
}