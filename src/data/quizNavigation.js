import { quizBoards, verifiedQuizPacks, getQuizPacks } from './quizPublic.js';
export const quizTracks = [
  { id: 'micro', name: 'Microeconomics', board: 'CBSE', classLevel: 11, stream: null },
  { id: 'macro', name: 'Macroeconomics', board: 'CBSE', classLevel: 12, stream: 'Macroeconomics' },
  { id: 'ied', name: 'Indian Economic Development', board: 'CBSE', classLevel: 12, stream: 'Indian Economic Development' },
  { id: 'gseb', name: 'GSEB Economics', board: 'GSEB', classLevel: 12, stream: null },
];
export function resolveQuizSelection(params) {
  const requested = verifiedQuizPacks.find(pack => pack.id === params.get('pack'));
  const legacy = quizTracks.find(track => track.id === params.get('subject'));
  const boardId = params.get('board') === 'GSEB' ? 'GSEB' : params.has('board') ? 'CBSE' : legacy?.board || requested?.board || 'CBSE';
  const classLevel = ['11','12'].includes(params.get('class')) ? Number(params.get('class')) : legacy?.classLevel || requested?.classLevel || 11;
  const subject = legacy ? 'Economics' : params.get('subject') || requested?.subject || 'Economics';
  const board = quizBoards.find(item => item.id === boardId);
  const classEntry = board.classes.find(item => item.classLevel === classLevel);
  const all = getQuizPacks(boardId, classLevel, subject);
  const streamTrack = quizTracks.find(track => track.id === params.get('stream')) || legacy;
  const stream = streamTrack?.board === boardId && streamTrack?.classLevel === classLevel && subject === 'Economics' ? streamTrack.stream
    : boardId === 'CBSE' && classLevel === 12 && subject === 'Economics' ? (all.find(pack => pack.id === requested?.id)?.stream || 'Macroeconomics') : null;
  const packs = all.filter(pack => !stream || pack.stream === stream);
  const selected = packs.find(pack => pack.id === requested?.id) || packs[0];
  const activeTrack = subject === 'Economics' ? quizTracks.find(track => track.board === boardId && track.classLevel === classLevel && (track.stream ? track.stream === (stream || selected?.stream) : !stream)) : null;
  return { boardId, classLevel, subject, board, classEntry, packs, selected, activeTrack };
}
export function quizSelectionParams({ boardId, classLevel, subject = 'Economics', trackId, packId }) {
  const track = quizTracks.find(item => item.id === trackId);
  const params = new URLSearchParams({ board: track?.board || boardId, class: String(track?.classLevel || classLevel), subject });
  if (track?.stream) params.set('stream', track.id);
  if (packId) params.set('pack', packId);
  const selected = resolveQuizSelection(params).selected;
  if (selected) params.set('pack', selected.id);
  else params.delete('pack');
  return params;
}
