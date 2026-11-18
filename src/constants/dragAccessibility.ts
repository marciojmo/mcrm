import type {
  Active,
  Announcements,
  Over,
  ScreenReaderInstructions,
} from '@dnd-kit/core';

function describeItem(item: Active | Over) {
  const name = item.data.current?.name;
  return item.data.current?.type === 'panel'
    ? `o painel ${name}`
    : `a tarefa ${name}`;
}

const screenReaderInstructions: ScreenReaderInstructions = {
  draggable:
    'Para pegar uma tarefa ou um painel, pressione Espaço. ' +
    'Enquanto arrasta, use as setas para mover. ' +
    'Pressione Espaço de novo para soltar na nova posição ou Esc para cancelar. ' +
    'Em uma tarefa, pressione Enter para abri-la.',
};

const announcements: Announcements = {
  onDragStart: ({ active }) => `Pegou ${describeItem(active)}.`,
  onDragOver: ({ active, over }) => {
    if (!over) return `Movendo ${describeItem(active)} fora da área de soltar.`;
    if (over.id === active.id) return `Movendo ${describeItem(active)}.`;
    return `Movendo ${describeItem(active)} sobre ${describeItem(over)}.`;
  },
  onDragEnd: ({ active, over }) => {
    if (!over) return `Soltou ${describeItem(active)} fora da área de soltar.`;
    if (over.id === active.id) return `Soltou ${describeItem(active)}.`;
    return `Soltou ${describeItem(active)} sobre ${describeItem(over)}.`;
  },
  onDragCancel: ({ active }) =>
    `Cancelado: ${describeItem(active)} voltou à posição original.`,
};

export const DRAG_ACCESSIBILITY = { screenReaderInstructions, announcements };
