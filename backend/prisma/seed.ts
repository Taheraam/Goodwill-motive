import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

function newObjectId(): string {
  let hex = '';
  const time = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  let counter = 0;
  while (hex.length < 24 - 8) {
    hex += Math.floor(Math.random() * 16).toString(16);
  }
  counter++;
  return (time + hex + counter.toString(16).padStart(6, '0')).slice(0, 24);
}

async function main() {
  const prisma = new PrismaClient();

  console.log('Seeding database...');

  const adminPasswordHash = await bcrypt.hash('Admin@1234', 10);
  const adminId = '000000000000000000000001';
  await prisma.user.upsert({
    where: { id: adminId },
    update: { role: 'admin' },
    create: {
      id: adminId,
      username: 'Admin',
      email: 'admin@goodwill.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
      contributionScore: 0,
      reputationScore: 0,
      streakCount: 0,
      longestStreak: 0,
    },
  });
  console.log('Admin user seeded: Admin / Admin@1234');

  await prisma.category.deleteMany();
  const catMath = newObjectId(), catSci = newObjectId(), catTech = newObjectId(), catLang = newObjectId(), catGlobal = newObjectId(), catHuman = newObjectId();
  const categories = [
    { id: catMath, name: 'Mathematics', description: 'Numbers, algebra, geometry, and beyond', type: 'learning' },
    { id: catSci, name: 'Science', description: 'Physics, chemistry, biology, and environmental science', type: 'learning' },
    { id: catTech, name: 'Technology', description: 'Programming, digital skills, and tech literacy', type: 'learning' },
    { id: catLang, name: 'Languages', description: 'English, Spanish, French, and more', type: 'language' },
    { id: catGlobal, name: 'Global Awareness', description: 'World events, cultures, and social issues', type: 'learning' },
    { id: catHuman, name: 'Humanitarian Topics', description: 'Poverty, health, education access, sustainability', type: 'humanitarian' },
  ];
  await prisma.category.createMany({ data: categories });
  console.log('Categories seeded.');

  await prisma.badge.deleteMany();
  const badges = [
    { id: newObjectId(), name: 'First Steps', description: 'Complete your first quiz', requirementType: 'milestone', requirementValue: 1 },
    { id: newObjectId(), name: 'On Fire', description: 'Maintain a 7-day streak', requirementType: 'streak', requirementValue: 7 },
    { id: newObjectId(), name: 'Unstoppable', description: 'Maintain a 30-day streak', requirementType: 'streak', requirementValue: 30 },
    { id: newObjectId(), name: 'Legendary', description: 'Maintain a 100-day streak', requirementType: 'streak', requirementValue: 100 },
    { id: newObjectId(), name: 'Quiz Whiz', description: 'Complete 50 quizzes', requirementType: 'milestone', requirementValue: 50 },
    { id: newObjectId(), name: "Teacher's Pet", description: 'Have 10 answers accepted', requirementType: 'teaching', requirementValue: 10 },
    { id: newObjectId(), name: 'Community Hero', description: 'Contribute to 10 community goals', requirementType: 'milestone', requirementValue: 10 },
    { id: newObjectId(), name: 'Rising Star', description: 'Reach 500 contribution score', requirementType: 'contribution', requirementValue: 500 },
    { id: newObjectId(), name: 'Humanitarian', description: 'Reach 2000 contribution score', requirementType: 'contribution', requirementValue: 2000 },
    { id: newObjectId(), name: 'Knowledge Builder', description: 'Create 10 lessons', requirementType: 'teaching', requirementValue: 10 },
  ];
  await prisma.badge.createMany({ data: badges });
  console.log('Badges seeded.');

  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  await prisma.mission.deleteMany();
  const missions = [
    { id: newObjectId(), title: 'Complete 3 Quizzes', description: 'Test your knowledge in any category. Each quiz earns you contribution points.', missionType: 'learning', contributionReward: 50, rules: { minQuizzes: 3 }, isDaily: true },
    { id: newObjectId(), title: 'Answer 1 Doubt', description: 'Help a fellow learner by answering their question.', missionType: 'teaching', contributionReward: 30, rules: { minAnswers: 1 }, isDaily: true },
    { id: newObjectId(), title: 'Join a Community Discussion', description: 'Engage with the community.', missionType: 'collaboration', contributionReward: 20, rules: { minDiscussions: 1 }, isDaily: true },
    { id: newObjectId(), title: 'Complete a Beginner Quiz', description: 'Start with an easy quiz.', missionType: 'learning', contributionReward: 15, rules: { difficulty: 'beginner' }, isDaily: false },
    { id: newObjectId(), title: 'Help 3 Learners', description: 'Answer questions from 3 different users.', missionType: 'teaching', contributionReward: 75, rules: { minHelpers: 3 }, isDaily: true },
  ];
  await prisma.mission.createMany({ data: missions.map(m => ({ ...m, startsAt: now, endsAt: endOfDay, isActive: true })) });
  console.log('Missions seeded.');

  await prisma.community.deleteMany();
  const communities = [
    { id: newObjectId(), title: 'Math Masters', description: 'A community for math enthusiasts.', type: 'study' },
    { id: newObjectId(), title: 'Science Explorers', description: 'Discover science together.', type: 'study' },
    { id: newObjectId(), title: 'Spanish Learners', description: 'Learn Spanish with others.', type: 'language' },
    { id: newObjectId(), title: 'Code Together', description: 'Collaborate and learn programming.', type: 'study' },
    { id: newObjectId(), title: 'Global Change Makers', description: 'Humanitarian impact worldwide.', type: 'humanitarian' },
  ];
  await prisma.community.createMany({ data: communities.map(c => ({ ...c, memberCount: Math.floor(Math.random() * 200) + 10 })) });
  console.log('Communities seeded.');

  await prisma.impactCampaign.deleteMany();
  await prisma.impactCampaign.create({
    data: {
      id: newObjectId(),
      name: 'Feed a Child Campaign',
      sponsor: 'GlobalLearn Foundation',
      description: 'For every 1000 quizzes completed, sponsor-backed meals are funded.',
      targetAmount: 5000,
      currentAmount: 1240,
      unit: 'meals',
      startsAt: now,
      endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  });
  console.log('Impact campaigns seeded.');

  await prisma.quiz.deleteMany();
  const sampleQuizzes = [
    {
      id: newObjectId(),
      title: 'Algebra Basics',
      difficulty: 'beginner',
      categoryId: catMath,
      contributionValue: 10,
      questions: [
        { id: newObjectId(), text: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correctOption: 1 },
        { id: newObjectId(), text: 'What is x if x + 5 = 10?', options: ['3', '4', '5', '6'], correctOption: 2 },
        { id: newObjectId(), text: 'What is 3 × 4?', options: ['10', '11', '12', '13'], correctOption: 2 },
        { id: newObjectId(), text: 'What is 10 ÷ 2?', options: ['3', '4', '5', '6'], correctOption: 2 },
        { id: newObjectId(), text: 'What is 7 - 3?', options: ['2', '3', '4', '5'], correctOption: 2 },
      ],
    },
    {
      id: newObjectId(),
      title: 'Climate Science',
      difficulty: 'beginner',
      categoryId: catSci,
      contributionValue: 15,
      questions: [
        { id: newObjectId(), text: 'What causes seasons on Earth?', options: ['Distance from sun', 'Earth\'s tilted axis', 'Ocean currents', 'Wind patterns'], correctOption: 1 },
        { id: newObjectId(), text: 'What gas is most responsible for global warming?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Helium'], correctOption: 2 },
        { id: newObjectId(), text: 'What is photosynthesis?', options: ['Water absorption', 'Converting sunlight to energy', 'Soil formation', 'Rock erosion'], correctOption: 1 },
        { id: newObjectId(), text: 'What is the largest ocean?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correctOption: 2 },
        { id: newObjectId(), text: 'What does a red sky at sunset indicate?', options: ['Rain coming', 'Clear weather', 'Snow', 'Hurricane'], correctOption: 0 },
      ],
    },
    {
      id: newObjectId(),
      title: 'Python Fundamentals',
      difficulty: 'beginner',
      categoryId: catTech,
      contributionValue: 20,
      questions: [
        { id: newObjectId(), text: 'How do you print "Hello" in Python?', options: ['echo("Hello")', 'print("Hello")', 'console.log("Hello")', 'printf("Hello")'], correctOption: 1 },
        { id: newObjectId(), text: 'What is the correct way to create a list?', options: ['(1, 2, 3)', '[1, 2, 3]', '{1, 2, 3}', '<1, 2, 3>'], correctOption: 1 },
        { id: newObjectId(), text: 'What does "len()" do?', options: ['Prints', 'Returns length', 'Deletes', 'Copies'], correctOption: 1 },
        { id: newObjectId(), text: 'Which symbol starts a comment?', options: ['//', '#', '/*', '--'], correctOption: 1 },
        { id: newObjectId(), text: 'What is a variable?', options: ['A number', 'A named storage location', 'A function', 'A loop'], correctOption: 1 },
      ],
    },
    {
      id: newObjectId(),
      title: 'World Geography',
      difficulty: 'beginner',
      categoryId: catGlobal,
      contributionValue: 10,
      questions: [
        { id: newObjectId(), text: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correctOption: 2 },
        { id: newObjectId(), text: 'What is the largest continent?', options: ['Africa', 'Europe', 'Asia', 'North America'], correctOption: 2 },
        { id: newObjectId(), text: 'How many continents are there?', options: ['5', '6', '7', '8'], correctOption: 2 },
        { id: newObjectId(), text: 'What is the longest river?', options: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'], correctOption: 1 },
        { id: newObjectId(), text: 'What country has the most people?', options: ['India', 'USA', 'China', 'Indonesia'], correctOption: 2 },
      ],
    },
  ];
  for (const q of sampleQuizzes) {
    await prisma.quiz.create({ data: q });
  }
  console.log('Quizzes seeded.');

  await prisma.$disconnect();
  console.log('Seeding complete!');
}

main().catch((e) => { console.error(e); process.exit(1); });
