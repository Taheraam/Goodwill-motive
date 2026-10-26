import { QuizzesService } from './quizzes.service';

const quiz = {
  id: 'q1',
  contributionValue: 50,
  questions: [
    { id: 'a', text: '1+1', options: ['1', '2'], correctOption: 1 },
    { id: 'b', text: '2+2', options: ['4', '5'], correctOption: 0 },
  ],
};

function setup(previousAttempts: Array<{ score: number; maxScore: number }> = []) {
  const prisma = {
    quiz: { findUnique: jest.fn().mockResolvedValue(quiz) },
    quizAttempt: {
      findMany: jest.fn().mockResolvedValue(previousAttempts),
      create: jest.fn().mockResolvedValue({}),
    },
  };
  const contributions = { record: jest.fn().mockResolvedValue({}) };
  return { svc: new QuizzesService(prisma as any, contributions as any), contributions };
}

describe('QuizzesService', () => {
  it('never sends correct answers to the client', async () => {
    const { svc } = setup();
    const res = await svc.get('q1');
    for (const q of res.questions) expect(q).not.toHaveProperty('correctOption');
  });

  it('does not count duplicate answers to the same question', async () => {
    const { svc } = setup();
    const res = await svc.attempt('u1', 'q1', [
      { questionId: 'a', selectedOption: 1 },
      { questionId: 'a', selectedOption: 1 },
      { questionId: 'a', selectedOption: 1 },
    ]);
    expect(res.score).toBe(1);
  });

  it('awards XP on the first pass only', async () => {
    const answers = [
      { questionId: 'a', selectedOption: 1 },
      { questionId: 'b', selectedOption: 0 },
    ];

    const first = setup([]);
    expect((await first.svc.attempt('u1', 'q1', answers)).contributionAwarded).toBe(50);

    const retake = setup([{ score: 2, maxScore: 2 }]);
    expect((await retake.svc.attempt('u1', 'q1', answers)).contributionAwarded).toBe(0);
    expect(retake.contributions.record).not.toHaveBeenCalled();
  });
});
