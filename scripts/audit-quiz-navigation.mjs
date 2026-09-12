import assert from 'node:assert/strict';
import { quizTracks, quizSelectionParams, resolveQuizSelection } from '../src/data/quizNavigation.js';
const counts = { micro:13, macro:5, ied:13, gseb:11 };
for (const track of quizTracks) {
  const params = quizSelectionParams({trackId:track.id});
  const selection = resolveQuizSelection(params);
  assert.equal(selection.activeTrack.id,track.id);
  assert.equal(selection.packs.length,counts[track.id]);
  assert.equal(selection.boardId,track.board);
  assert.equal(selection.classLevel,track.classLevel);
  for(const pack of selection.packs) {
    const roundTrip=resolveQuizSelection(quizSelectionParams({trackId:track.id,packId:pack.id}));
    assert.equal(roundTrip.selected.id,pack.id);
    assert.equal(roundTrip.activeTrack.id,track.id);
  }
}
for (const trackId of ['macro','ied']) {
  const legacy=resolveQuizSelection(new URLSearchParams({subject:trackId}));
  assert.equal(legacy.activeTrack.id,trackId);assert.equal(legacy.packs.length,counts[trackId]);
}
const stale=resolveQuizSelection(new URLSearchParams('board=CBSE&class=11&subject=Economics&pack=gseb-12-economics-ch3'));
assert.equal(stale.activeTrack.id,'micro');assert.ok(stale.selected.id.startsWith('cbse-11-micro'));
const directIED=resolveQuizSelection(new URLSearchParams('pack=cbse-12-ied-ch2'));
assert.equal(directIED.activeTrack.id,'ied');assert.equal(directIED.packs.length,13);
const bst=resolveQuizSelection(quizSelectionParams({boardId:'CBSE',classLevel:12,subject:'Business Studies'}));
assert.ok(bst.selected);assert.equal(bst.activeTrack,null);assert.equal(bst.subject,'Business Studies');
const unavailable=resolveQuizSelection(quizSelectionParams({boardId:'GSEB',classLevel:11}));
assert.equal(unavailable.packs.length,0);assert.equal(unavailable.selected,undefined);
console.log('PASS: all 4 subject shortcuts, 42 chapter deep links, legacy links, stale selections and unpublished classes.');
