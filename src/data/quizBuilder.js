const LEVELS = ['Easy', 'Moderate', 'Hard', 'Extreme'];

function placeCorrect(correct, wrongs, position) {
  const cleanWrongs = wrongs.filter((item) => item && item !== correct).slice(0, 3);
  while (cleanWrongs.length < 3) cleanWrongs.push('None of these statements correctly explains the concept');
  const options = [...cleanWrongs];
  options.splice(position % 4, 0, correct);
  return { options, answer: position % 4 };
}

function otherItems(items, index, field) {
  const offsets = [1, 3, 6];
  return offsets.map((offset) => items[(index + offset) % items.length]?.[field]).filter(Boolean);
}

function make(q, options, answer, explanation) {
  return { q, options, answer, explanation };
}

export function buildConceptQuizPack(meta, concepts) {
  if (!Array.isArray(concepts) || concepts.length !== 10) {
    throw new Error(`Quiz pack "${meta?.title || 'unknown'}" must contain exactly 10 verified concepts.`);
  }

  const levels = Object.fromEntries(LEVELS.map((level) => [level, []]));

  concepts.forEach((concept, index) => {
    const meaningWrongs = otherItems(concepts, index, 'meaning');
    const termWrongs = otherItems(concepts, index, 'term');
    const explanation = `${concept.term}: ${concept.meaning}`;

    {
      const { options, answer } = placeCorrect(concept.meaning, meaningWrongs, index % 4);
      levels.Easy.push(make(
        `Which statement best explains "${concept.term}"?`,
        options,
        answer,
        explanation,
      ));
    }

    {
      const { options, answer } = placeCorrect(concept.term, termWrongs, (index + 1) % 4);
      levels.Moderate.push(make(
        `Which concept best matches this situation? ${concept.example}`,
        options,
        answer,
        explanation,
      ));
    }

    {
      const wrongs = [concept.trap, ...meaningWrongs].filter(Boolean);
      const { options, answer } = placeCorrect(concept.meaning, wrongs, (index + 2) % 4);
      levels.Hard.push(make(
        `Which statement about "${concept.term}" is most accurate?`,
        options,
        answer,
        `${explanation} The tempting error to avoid is: ${concept.trap}`,
      ));
    }

    {
      const { options, answer } = placeCorrect(concept.meaning, meaningWrongs, (index + 3) % 4);
      levels.Extreme.push(make(
        `A student says: "${concept.trap}" What is the best correction?`,
        options,
        answer,
        `${explanation} This question tests correction of a common misconception rather than simple recall.`,
      ));
    }
  });

  return { ...meta, levels };
}
