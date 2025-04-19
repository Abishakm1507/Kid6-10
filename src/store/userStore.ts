import { create } from 'zustand';

export type Subject = 
  | 'shapes' 
  | 'fruits' 
  | 'vegetables' 
  | 'animals' 
  | 'math' 
  | 'history' 
  | 'space' 
  | 'ocean' 
  | 'country' 
  | 'alphabets';

interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
}

interface Challenge {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  progress: number;
  total: number;
}

interface UserState {
  isLoggedIn: boolean;
  initialized: boolean;
  name: string;
  email: string;
  age: number | null;
  favoriteColor: string;
  selectedSubjects: Subject[];
  streak: number;
  lastActive: string | null;
  xp: number;
  badges: Badge[];
  challenges: Challenge[];
  settings: {
    avatar: {
      hair: string;
      eyes: string;
      skin: string;
      clothes: string;
    };
  };
  onboardingCompleted: boolean;

  // Actions
  initializeFromLocalStorage: () => void;
  login: (name: string, email: string) => void;
  logout: () => void;
  updateOnboarding: (data: {
    age: number;
    favoriteColor: string;
    selectedSubjects: Subject[];
  }) => void;
  completeOnboarding: () => void;
  addXp: (amount: number) => void;
  updateStreak: () => void;
  earnBadge: (badgeId: string) => void;
  updateChallengeProgress: (challengeId: string, progress: number) => void;
  updateAvatar: (avatarData: Partial<UserState['settings']['avatar']>) => void;
}

// Initial badges
const initialBadges: Badge[] = [
  {
    id: 'first-login',
    name: 'First Day of School',
    description: 'Logged in for the first time',
    earned: false,
  },
  {
    id: 'streak-3',
    name: 'On a Roll',
    description: 'Maintained a 3-day streak',
    earned: false,
  },
  {
    id: 'shapes-master',
    name: 'Shape Master',
    description: 'Completed all shape lessons and quizzes',
    earned: false,
  },
  {
    id: 'alphabet-ace',
    name: 'Alphabet Ace',
    description: 'Learned all the alphabets',
    earned: false,
  },
  {
    id: 'game-winner',
    name: 'Game Winner',
    description: 'Won an educational game',
    earned: false,
  },
];

// Initial challenges
const initialChallenges: Challenge[] = [
  {
    id: 'daily-facts',
    name: 'Fact Finder',
    description: 'Read 5 daily facts',
    completed: false,
    progress: 0,
    total: 5,
  },
  {
    id: 'complete-quizzes',
    name: 'Quiz Whiz',
    description: 'Complete 3 quizzes',
    completed: false,
    progress: 0,
    total: 3,
  },
  {
    id: 'play-games',
    name: 'Game Explorer',
    description: 'Play 2 different games',
    completed: false,
    progress: 0,
    total: 2,
  },
];

export const useUserStore = create<UserState>((set, get) => ({
  isLoggedIn: false,
  initialized: false,
  name: '',
  email: '',
  age: null,
  favoriteColor: '#6366f1', // Default primary color
  selectedSubjects: [],
  streak: 0,
  lastActive: null,
  xp: 0,
  badges: initialBadges,
  challenges: initialChallenges,
  settings: {
    avatar: {
      hair: 'default',
      eyes: 'default',
      skin: 'default',
      clothes: 'default',
    },
  },
  onboardingCompleted: false,

  initializeFromLocalStorage: () => {
    const userData = localStorage.getItem('userData');
    
    if (userData) {
      const parsedData = JSON.parse(userData);
      set({ ...parsedData, initialized: true });
    } else {
      set({ initialized: true });
    }
  },

  login: (name, email) => {
    const badges = [...initialBadges];
    const firstLoginBadge = badges.find(badge => badge.id === 'first-login');
    
    if (firstLoginBadge) {
      firstLoginBadge.earned = true;
      firstLoginBadge.earnedDate = new Date().toISOString();
    }

    const userData = {
      isLoggedIn: true,
      name,
      email,
      streak: 1,
      lastActive: new Date().toISOString(),
      badges,
      xp: 10, // Initial XP for signing up
    };
    
    set(userData);
    localStorage.setItem('userData', JSON.stringify({ ...get(), ...userData }));
  },

  logout: () => {
    set({
      isLoggedIn: false,
      name: '',
      email: '',
      age: null,
      favoriteColor: '#6366f1',
      selectedSubjects: [],
      streak: 0,
      lastActive: null,
      xp: 0,
      badges: initialBadges,
      challenges: initialChallenges,
      onboardingCompleted: false,
      settings: {
        avatar: {
          hair: 'default',
          eyes: 'default',
          skin: 'default',
          clothes: 'default',
        },
      },
    });
    localStorage.removeItem('userData');
  },

  updateOnboarding: (data) => {
    set({
      age: data.age,
      favoriteColor: data.favoriteColor,
      selectedSubjects: data.selectedSubjects,
    });
    localStorage.setItem('userData', JSON.stringify(get()));
  },

  completeOnboarding: () => {
    set({ onboardingCompleted: true });
    localStorage.setItem('userData', JSON.stringify(get()));
  },

  addXp: (amount) => {
    set({ xp: get().xp + amount });
    localStorage.setItem('userData', JSON.stringify(get()));
  },

  updateStreak: () => {
    const { lastActive, streak } = get();
    const today = new Date();
    const lastActiveDate = lastActive ? new Date(lastActive) : null;
    
    // If last active was yesterday, increment streak
    if (lastActiveDate) {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      
      const isLastActiveYesterday = 
        lastActiveDate.getDate() === yesterday.getDate() &&
        lastActiveDate.getMonth() === yesterday.getMonth() &&
        lastActiveDate.getFullYear() === yesterday.getFullYear();
      
      const isLastActiveToday =
        lastActiveDate.getDate() === today.getDate() &&
        lastActiveDate.getMonth() === today.getMonth() &&
        lastActiveDate.getFullYear() === today.getFullYear();
      
      if (isLastActiveYesterday) {
        const newStreak = streak + 1;
        set({ 
          streak: newStreak, 
          lastActive: today.toISOString() 
        });
        
        // Check if we earned the 3-day streak badge
        if (newStreak >= 3) {
          get().earnBadge('streak-3');
        }
      } else if (!isLastActiveToday) {
        // If not yesterday and not today, reset streak
        set({ streak: 1, lastActive: today.toISOString() });
      }
    } else {
      // First time active
      set({ streak: 1, lastActive: today.toISOString() });
    }
    
    localStorage.setItem('userData', JSON.stringify(get()));
  },

  earnBadge: (badgeId) => {
    const badges = [...get().badges];
    const badge = badges.find(b => b.id === badgeId);
    
    if (badge && !badge.earned) {
      badge.earned = true;
      badge.earnedDate = new Date().toISOString();
      set({ badges, xp: get().xp + 50 }); // Award XP for earning a badge
      localStorage.setItem('userData', JSON.stringify(get()));
    }
  },

  updateChallengeProgress: (challengeId, progress) => {
    const challenges = [...get().challenges];
    const challenge = challenges.find(c => c.id === challengeId);
    
    if (challenge) {
      challenge.progress = Math.min(challenge.total, challenge.progress + progress);
      challenge.completed = challenge.progress >= challenge.total;
      
      if (challenge.completed) {
        // Award XP for completing a challenge
        set({ xp: get().xp + 30 });
      }
      
      set({ challenges });
      localStorage.setItem('userData', JSON.stringify(get()));
    }
  },

  updateAvatar: (avatarData) => {
    set({
      settings: {
        ...get().settings,
        avatar: {
          ...get().settings.avatar,
          ...avatarData,
        },
      },
    });
    localStorage.setItem('userData', JSON.stringify(get()));
  },
}));