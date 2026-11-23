export const BOARD_BACKGROUNDS = [
  { key: 'blue', name: 'Azul', value: '#2f5fd0' },
  { key: 'green', name: 'Verde', value: '#2e8b57' },
  { key: 'purple', name: 'Roxo', value: '#7c5cd6' },
  { key: 'orange', name: 'Laranja', value: '#d9692f' },
  { key: 'slate', name: 'Cinza-azulado', value: '#5b6b7f' },
  {
    key: 'ocean',
    name: 'Oceano',
    value: 'linear-gradient(135deg, #2f5fd0, #22a6b3)',
  },
  {
    key: 'sunset',
    name: 'Pôr do sol',
    value: 'linear-gradient(135deg, #f0864a, #d94f8a)',
  },
  {
    key: 'aurora',
    name: 'Aurora',
    value: 'linear-gradient(135deg, #7c5cd6, #22a6b3)',
  },
];

export function getBoardBackgroundValue(key: string | null) {
  return BOARD_BACKGROUNDS.find((option) => option.key === key)?.value;
}
