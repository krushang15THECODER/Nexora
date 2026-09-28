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
  { id: 'openai/gpt-4o-mini', name: 'gpt-4o-mini' },
  { id: 'nvidia/nemotron-3.5-lightning:free', name: 'nemotron-3.5' },
  { id: 'google/gemini-2.5-flash-pro', name: 'gemini-2.5-flash' }
];
