const allCharacterReactions = [
  {
    category: "happy",
    emojis: [
      { name: "smile", symbol: "😊" },
      { name: "grin", symbol: "😁" },
      { name: "laughing", symbol: "😆" },
      { name: "joy", symbol: "😂" },
      { name: "blush", symbol: "😊" },
      { name: "relaxed", symbol: "☺️" },
      { name: "heart eyes", symbol: "😍" },
      { name: "star struck", symbol: "🤩" },
      { name: "hugging", symbol: "🤗" },
      { name: "wink", symbol: "😉" },
      { name: "relieved", symbol: "😌" },
      { name: "innocent", symbol: "😇" },
      { name: "party face", symbol: "🥳" }
    ]
  },
  {
    category: "sad",
    emojis: [
      { name: "disappointed", symbol: "😞" },
      { name: "crying", symbol: "😢" },
      { name: "sobbing", symbol: "😭" },
      { name: "pensive", symbol: "😔" },
      { name: "weary", symbol: "😩" },
      { name: "anxious", symbol: "😰" },
      { name: "frowning", symbol: "☹️" },
      { name: "pleading", symbol: "🥺" }
    ]
  },
  {
    category: "angry",
    emojis: [
      { name: "angry", symbol: "😠" },
      { name: "rage", symbol: "😡" },
      { name: "cursing", symbol: "🤬" },
      { name: "pouting", symbol: "😡" },
      { name: "unamused", symbol: "😒" },
      { name: "steaming", symbol: "😤" }
    ]
  },
  {
    category: "fear",
    emojis: [
      { name: "screaming", symbol: "😱" },
      { name: "fearful", symbol: "😨" },
      { name: "cold sweat", symbol: "😰" },
      { name: "flushed", symbol: "😳" },
      { name: "dizzy", symbol: "😵" },
      { name: "astonished", symbol: "😲" },
      { name: "exploding head", symbol: "🤯" }
    ]
  },
  {
    category: "thinking",
    emojis: [
      { name: "thinking", symbol: "🤔" },
      { name: "raised eyebrow", symbol: "🤨" },
      { name: "confused", symbol: "😕" },
      { name: "upside down", symbol: "🙃" },
      { name: "monocle", symbol: "🧐" }
    ]
  },
  {
    category: "embarrassed",
    emojis: [
      { name: "grimacing", symbol: "😬" },
      { name: "flushed", symbol: "😳" },
      { name: "sweat smile", symbol: "😅" },
      { name: "hand over mouth", symbol: "🤭" },
      { name: "facepalm", symbol: "🤦" },
      { name: "nervous", symbol: "😟" }
    ]
  },
  {
    category: "sleepy",
    emojis: [
      { name: "sleeping", symbol: "😴" },
      { name: "sleepy", symbol: "😪" },
      { name: "tired", symbol: "😫" },
      { name: "yawning", symbol: "🥱" }
    ]
  },
  {
    category: "love/affection",
    emojis: [
      { name: "kissing", symbol: "😘" },
      { name: "blowing kiss", symbol: "😗" },
      { name: "holding back tears", symbol: "🥹" }
    ]
  }
];


export const characterReactions = [
    {
        category: "happy",
        emojis: [
            { name: "smile", symbol: "😊" },
            { name: "grin", symbol: "😁" },
            { name: "laughing", symbol: "😆" },
            { name: "joy", symbol: "😂" },
            { name: "blush", symbol: "😊" },
            { name: "relaxed", symbol: "☺️" },
            { name: "heart eyes", symbol: "😍" },
            { name: "star struck", symbol: "🤩" },
            { name: "hugging", symbol: "🤗" },
            { name: "wink", symbol: "😉" },
            { name: "relieved", symbol: "😌" },
            { name: "innocent", symbol: "😇" },
            { name: "party face", symbol: "🥳" }
        ]
    },
    {
        category: "sad",
        emojis: [
            { name: "disappointed", symbol: "😞" },
            { name: "crying", symbol: "😢" },
            { name: "sobbing", symbol: "😭" },
            { name: "pensive", symbol: "😔" },
            { name: "weary", symbol: "😩" },
            { name: "anxious", symbol: "😰" },
            { name: "frowning", symbol: "☹️" },
            { name: "pleading", symbol: "🥺" }
        ]
    },
    {
        category: "angry",
        emojis: [
            { name: "angry", symbol: "😠" },
            { name: "rage", symbol: "😡" },
            { name: "cursing", symbol: "🤬" },
            { name: "pouting", symbol: "😡" },
            { name: "unamused", symbol: "😒" },
            { name: "steaming", symbol: "😤" }
        ]
    },
    {
        category: "fear",
        emojis: [
            { name: "screaming", symbol: "😱" },
            { name: "fearful", symbol: "😨" },
            { name: "cold sweat", symbol: "😰" },
            { name: "flushed", symbol: "😳" },
            { name: "dizzy", symbol: "😵" },
            { name: "astonished", symbol: "😲" },
            { name: "exploding head", symbol: "🤯" }
        ]
    },
    {
        category: "thinking",
        emojis: [
            { name: "thinking", symbol: "🤔" },
            { name: "raised eyebrow", symbol: "🤨" },
            { name: "confused", symbol: "😕" },
            { name: "upside down", symbol: "🙃" },
            { name: "monocle", symbol: "🧐" }
        ]
    },
    {
        category: "embarrassed",
        emojis: [
            { name: "grimacing", symbol: "😬" },
            { name: "flushed", symbol: "😳" },
            { name: "sweat smile", symbol: "😅" },
            { name: "hand over mouth", symbol: "🤭" },
            { name: "facepalm", symbol: "🤦" },
            { name: "nervous", symbol: "😟" }
        ]
    },
    {
        category: "sleepy",
        emojis: [
            { name: "sleeping", symbol: "😴" },
            { name: "sleepy", symbol: "😪" },
            { name: "tired", symbol: "😫" },
            { name: "yawning", symbol: "🥱" }
        ]
    },
    {
        category: "love/affection",
        emojis: [
            { name: "kissing", symbol: "😘" },
            { name: "blowing kiss", symbol: "😗" },
            { name: "holding back tears", symbol: "🥹" }
        ]
    }
];

export const reactions = [
    { name: "smile", symbol: "😊" },
    { name: "grin", symbol: "😁" },
    { name: "laughing", symbol: "😆" },
    { name: "joy", symbol: "😂" },
    { name: "blush", symbol: "😊" },
    { name: "relaxed", symbol: "☺️" },
    { name: "heart eyes", symbol: "😍" },
    { name: "star struck", symbol: "🤩" },
    { name: "hugging", symbol: "🤗" },
    { name: "wink", symbol: "😉" },
    { name: "relieved", symbol: "😌" },
    { name: "innocent", symbol: "😇" },
    { name: "party face", symbol: "🥳" },

    { name: "disappointed", symbol: "😞" },
    { name: "crying", symbol: "😢" },
    { name: "sobbing", symbol: "😭" },
    { name: "pensive", symbol: "😔" },
    { name: "weary", symbol: "😩" },
    { name: "anxious", symbol: "😰" },
    { name: "frowning", symbol: "☹️" },
    { name: "pleading", symbol: "🥺" },
    { name: "angry", symbol: "😠" },
    { name: "rage", symbol: "😡" },
    { name: "cursing", symbol: "🤬" },
    { name: "pouting", symbol: "😡" },
    { name: "unamused", symbol: "😒" },
    { name: "steaming", symbol: "😤" },

    { name: "screaming", symbol: "😱" },
    { name: "fearful", symbol: "😨" },
    { name: "cold sweat", symbol: "😰" },
    { name: "flushed", symbol: "😳" },
    { name: "dizzy", symbol: "😵" },
    { name: "astonished", symbol: "😲" },
    { name: "exploding head", symbol: "🤯" },

    { name: "thinking", symbol: "🤔" },
    { name: "raised eyebrow", symbol: "🤨" },
    { name: "confused", symbol: "😕" },
    { name: "upside down", symbol: "🙃" },
    { name: "monocle", symbol: "🧐" },

    { name: "grimacing", symbol: "😬" },
    { name: "flushed", symbol: "😳" },
    { name: "sweat smile", symbol: "😅" },
    { name: "hand over mouth", symbol: "🤭" },
    { name: "facepalm", symbol: "🤦" },
    { name: "nervous", symbol: "😟" },

    { name: "sleeping", symbol: "😴" },
    { name: "sleepy", symbol: "😪" },
    { name: "tired", symbol: "😫" },
    { name: "yawning", symbol: "🥱" },

    { name: "kissing", symbol: "😘" },
    { name: "blowing kiss", symbol: "😗" },
    { name: "holding back tears", symbol: "🥹" }
]

/**
 * Formats a list of reaction objects into a prompt string.
 * @param {Array} reactions - Array of { name, symbol } objects.
 * @param {Object} options
 * @param {boolean} [options.bulletList=false] - Format with bullet points instead of inline.
 * @returns {string}
 */
export const formatReactionsPrompt = (options = { bulletList: false }) => {
  if (!Array.isArray(reactions)) return '';

  return reactions.map(r => {
    const formatted = `${r.name}`;
    // const formatted = `${r.name} (${r.symbol})`;
    return options.bulletList ? `- ${formatted}` : formatted;
  }).join(options.bulletList ? '\n' : ', ');
}


export const findReactionSymbolByName = (name) => {
    return reactions?.find(reaction => reaction?.name === name)?.symbol ?? ""
}