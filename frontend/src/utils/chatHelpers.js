export const groupChats = (chats) => {
  const today = [];
  const yesterday = [];
  const earlier = [];

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;

  chats.forEach((chat) => {
    const updatedAt = new Date(chat.updatedAt).getTime();
    if (updatedAt >= todayStart) {
      today.push(chat);
    } else if (updatedAt >= yesterdayStart) {
      yesterday.push(chat);
    } else {
      earlier.push(chat);
    }
  });

  return { today, yesterday, earlier };
};

export const SUPPORTED_MODELS = [
  // 1. OpenAI
  { id: 'openai/gpt-4o-mini', name: 'OpenAI: GPT-4o-mini' },

  // 2. Google (Free)
  { id: 'google/gemma-4-31b-it:free', name: 'Google: Gemma 4 31B (free)' },
  { id: 'google/gemma-4-26b-a4b-it:free', name: 'Google: Gemma 4 26B (free)' },

  // 3. NVIDIA (Free)
  { id: 'nvidia/nemotron-3.5-lightning:free', name: 'NVIDIA: Nemotron 3.5 Lightning (free)' },
  { id: 'nvidia/nemotron-3-ultra-550b-a55b:free', name: 'NVIDIA: Nemotron 3 Ultra 550B (free)' },
  { id: 'nvidia/nemotron-3.5-super-vl:free', name: 'NVIDIA: Nemotron 3.5 Super VL (free)' },
  { id: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free', name: 'NVIDIA: Nemotron 3 Nano Omni (free)' },

  // 4. Other Leading Providers (Free)
  { id: 'openrouter/free', name: 'OpenRouter: Free Router (free)' },
  { id: 'cohere/north-mini-code:free', name: 'Cohere: North Mini Code (free)' },
  { id: 'liquid/lfm-3-1.7b:free', name: 'LiquidAI: LFM3 1.7B (free)' }
];
