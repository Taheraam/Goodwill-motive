export interface KnowledgeItem {
  id: string;
  category: 'platform' | 'scoring' | 'donations' | 'learning' | 'streaks' | 'security';
  title: string;
  keywords: string[];
  content: string;
  suggestedQuestions?: string[];
}

export const KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    id: 'about-goodwill-motive',
    category: 'platform',
    title: 'What is The Goodwill Motive?',
    keywords: ['goodwill', 'motive', 'platform', 'what is', 'mission', 'about', 'how it works'],
    content: `The Goodwill Motive is a humanitarian social-learning ecosystem. As users study, take quizzes, complete community learning missions, and answer questions, their activity earns Contribution Score (XP). This collective learning activity unlocks sponsor funds that are directly converted into real-world aid—such as nutritious meals, education supplies, and medical relief for vulnerable communities.`,
    suggestedQuestions: [
      'How does learning turn into real food and aid?',
      'How do I earn Contribution Score?',
      'How can I sponsor meals directly?'
    ],
  },
  {
    id: 'how-meals-are-funded',
    category: 'donations',
    title: 'How Learning Converts to Real Meals',
    keywords: ['meals', 'convert', 'aid', 'fund', 'sponsors', 'ngo', 'distribution', 'real lives', 'food'],
    content: `Meals are funded through two streams:
1. Community Learning Milestones: Philanthropic sponsors and corporate partners pledge funds against community learning goals. When our learners reach collective study targets, funds are unlocked to partner NGOs.
2. Direct Meal Sponsorships: Donors and supporters can sponsor meals directly starting at ₹25/meal through our secure Razorpay gateway.
Every meal distribution is tracked transparently with geotagged logs and NGO partner receipts.`,
    suggestedQuestions: [
      'Is my donation tax exempt?',
      'How transparent are the donations?',
      'Who are the partner NGOs?'
    ],
  },
  {
    id: 'contribution-scoring',
    category: 'scoring',
    title: 'Contribution Score & XP Rules',
    keywords: ['score', 'xp', 'points', 'rules', 'earn', 'rewards', 'leaderboard'],
    content: `You can earn Contribution Score (XP) across multiple actions:
• Completing a daily quiz: +10 to +30 XP based on accuracy.
• Creating a helpful lesson or study guide: +50 XP.
• Asking a thoughtful academic question: +5 XP.
• Providing a verified, accepted answer: +25 XP.
• Maintaining consecutive daily streaks: up to 2.5x multiplier on all earned XP!
• Direct humanitarian meal sponsorship: +2 XP for every ₹1 contributed.`,
    suggestedQuestions: [
      'How do daily streaks work?',
      'What happens if I break my streak?',
      'How do I rank up on the leaderboard?'
    ],
  },
  {
    id: 'streaks-and-badges',
    category: 'streaks',
    title: 'Streak Multipliers and Badges',
    keywords: ['streak', 'flame', 'multiplier', 'badge', 'daily', 'consistency', 'reward'],
    content: `Consistency is key! Logging in and completing at least one quiz, answer, or lesson each day increments your Day Streak.
Streak milestones:
• 3-Day Streak: 1.1x XP Multiplier + "Curious Sprout" badge.
• 7-Day Streak: 1.25x XP Multiplier + "Consistent Beacon" badge.
• 30-Day Streak: 1.5x XP Multiplier + "Goodwill Champion" badge.
• 100-Day Streak: 2.0x XP Multiplier + permanent humanitarian recognition on the global Hall of Fame.`,
    suggestedQuestions: [
      'How do I view my badges?',
      'How do I join a community?',
      'How do I report spam?'
    ],
  },
  {
    id: 'payment-and-security',
    category: 'security',
    title: 'Razorpay Payment Security and Transparency',
    keywords: ['payment', 'razorpay', 'secure', 'card', 'upi', 'receipt', 'safe', 'refund', 'tax'],
    content: `All direct donations and sponsorships are encrypted and processed through Razorpay, a PCI-DSS Level 1 compliant payment gateway supporting UPI, Credit/Debit Cards, NetBanking, and Wallets.
Immediately after a successful sponsorship:
1. You receive an official digital Impact Certificate & Receipt via email.
2. The live campaign meal counter increments instantly.
3. Your personal impact dashboard updates with meals funded and contribution points.`,
    suggestedQuestions: [
      'How do I get an email receipt?',
      'Can I sponsor a specific campaign?',
      'How do I delete my account?'
    ],
  },
  {
    id: 'communities-and-qa',
    category: 'learning',
    title: 'Study Communities and Peer Q&A',
    keywords: ['community', 'study', 'math', 'science', 'tech', 'qa', 'questions', 'ask', 'answer'],
    content: `Goodwill Motive features dedicated study circles for Mathematics, Computer Science, Biology, Environmental Studies, and Humanitarian Economics.
You can post challenging questions, collaborate on solutions, upvote high-quality explanations, and earn reputation points endorsed by peers and mentors.`,
    suggestedQuestions: [
      'How to post a question?',
      'How to become a community moderator?',
      'What are the community guidelines?'
    ],
  },
];
