import { defineStore } from 'pinia';
import { computed, ref,watch } from 'vue';
// import { supabase, type LeaderboardEntry } from '../lib/supabase';
import api from '../lib/api';
import type { Theme } from '../models/Theme';
import type { Level } from '../models/Level';
import type { Category } from '../models/Category';
import { useAuthStore } from './auth';
import type { User } from '../models/User';
import { QuestionOption } from '../models/QuestionOption';
const gameApiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/game-ai`;
import type { Question } from '../models/Question';
import type { SubCategory } from '../models/SubCategory';
const headers = {
  'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};


type GameStatus = 'idle' | 'playing' | 'won' | 'lost' | 'awaiting_guess';
interface GameEntity {
  name: string;
  description?: string;
  image_url?: string | null;
  attributes?: {
    nationality?: string | null;
    league?: string | null;
    currentTeam?: string | null;
    footed?: string | null;
    [key: string]: any;
  };
}
interface GameState {
  sessionId: string | null;
  user: User | null;
  selectedTheme: Theme | null;
  selectedLevel: Level | null;
  categories: Category[];
  selectedCategory: Category | null;
  subCategories: SubCategory[];
  selectedSubCategory: SubCategory | null;
  loseReason?: 'time_up' | 'guess_wrong' | 'gave_up' | 'categories_limit';
  timeUp: boolean
  questions: Question[];
  conversation: { option: QuestionOption; answer: boolean }[];
  questionsAsked: number;
  subCategoriesLimit: number | null;
  timeLimit: number;
  timeRemaining: number;
 status: GameStatus;
  entity: GameEntity | null
  score: number;
  resultSummary?: {
    type: 'win' | 'lose';
    message: string;
  } | null;

  selectedGuessEntity: {
  id: string;
  name: string;
  image_url?: string | null;
  attributes?: any;
} | null;
}

export const useGameStore = defineStore('game', () => {
  const state = ref<GameState>({
    sessionId: null,
    user: null,
    selectedTheme: null,
    selectedLevel: null,
    categories: [],
    selectedCategory: null,
    questions: [],
    conversation: [],
    loseReason: null,
    questionsAsked: 0,
    subCategoriesLimit: null,
    timeLimit: null,
    timeRemaining: null,
    selectedGuessEntity: null,
     status: 'idle' as GameStatus,
    entity: null,
    resultSummary: null,
    score: 0,
    subCategories: [],
    selectedSubCategory: null,
    timeUp: false,
  });

  let timerInterval: number | null = null;

const isCategoriesLimitReached = computed(() => {
  if (state.value.subCategoriesLimit === null) return false;
  return state.value.subCategoriesLimit <= 0;
});
watch(
  () => state.value.status,
  (status) => {
    console.log('⏱ status changed →', status);

    if (status === 'playing') {
      startTimer();
    } else {
      stopTimer();
    }
  }
);
  const isPlaying = computed(() => state.value.status === 'playing');
  const askedQuestionsCount = computed(() => state.value.questionsAsked);
  const categoriesRemaining = computed(() => {
    return state.value.subCategoriesLimit;
  });

  const timeElapsed = computed(() => state.value.timeLimit - state.value.timeRemaining);
  const canAskQuestion = computed(() => {
    if (state.value.timeRemaining <= 0) return false;
    if (state.value.subCategoriesLimit === null) return true;
    return state.value.subCategoriesLimit > 0;
  }); async function fetchThemeById(id: string): Promise<Theme> {
    try {
      const res = await api.get(`/themes/${id}`);
      const raw = res.data.data || res.data;

      return {
        id: raw.id,
        name: raw.name,
        slug: raw.slug,
        icon: raw.icon,
        description: raw.description,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      } as Theme;

    } catch (err) {
      console.error("Error fetching theme by id:", err);
      return null;
    }
  }
function setSelectedGuessEntity(entity: any) {
  state.value.selectedGuessEntity = entity;
}

function clearSelectedGuessEntity() {
  state.value.selectedGuessEntity = null;
}
  async function fetchLevelById(id: string): Promise<Level> {
    try {
      const res = await api.get(`/levels/${id}`);
      const raw = res.data.data || res.data;

      return {
        id: raw.id,
        name: raw.name,
        hint: raw.hint,
        slug: raw.slug,
        questions_per_attempt: raw.questions_per_attempt,
        time_per_attempt: raw.time_per_attempt,
        categories_count: raw.categories_count,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
        level_time: raw.level_time,
        sub_categories_limit: raw.sub_categories_limit,
      } as Level;

    } catch (err) {
      console.error("Error fetching level by id:", err);
      return null;
    }
  }

  async function fetchUserById(id: string): Promise<User | null> {
    try {
      const res = await api.get(`/users/${id}`);
      const raw = res.data.data || res.data;

      return {
        id: raw.id,
        name: raw.name,
        email: raw.email,
        avatar_url: raw.avatar_url,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      } as User;

    } catch (err) {
      console.error("Error fetching user by id:", err);
      return null;
    }
  }


  async function startGame(theme: Theme, level: Level) {
    try {

      const auth = useAuthStore();
      if (!auth.user) {
        console.error("❌ No authenticated user found!");
        return false;
      }

      const response = await api.post('/start-game', {
        theme_id: theme.id,
        level_id: level.id,
      });

      const data = response.data.data || response.data;

      state.value.sessionId = data.session_token;
      state.value.user = auth.user;
      state.value.selectedTheme = theme;
      state.value.selectedLevel = level;
      state.value.questions = [];
      state.value.conversation = [];
      state.value.questionsAsked = 0;

      state.value.timeUp = false;   
state.value.loseReason = null;

      state.value.categories = (data.categories || []).map((cat: any) => {
        console.log('image', cat.image);

        return {

          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          image: cat.image,
          description: cat.description,
       
          sub_categories: cat.sub_categories || [],
        }

      }
      );


      state.value.subCategoriesLimit = level.sub_categories_limit;
      state.value.timeLimit = level.level_time;
      state.value.timeRemaining = level.level_time;
     
      state.value.entity = null;
      state.value.score = 0;
   
      state.value.status = 'playing';

      return true;
    } catch (error) {
      console.error('Error starting game:', error);
      return false;
    }
  }
async function verifyGuess(guessEntityId: string) {
  if (!state.value.sessionId) {
    console.error('No active session to verify guess.');
    return null;
  }

  try {
    const response = await api.post('/verify-guess', {
      session_token: state.value.sessionId,
      guess_entity_id: guessEntityId,
    });

    const data = response.data.data;

    if (data.entity) {
      state.value.entity = {
        name: data.entity.name,
        image_url: data.entity.image_url,
        attributes: data.entity.attributes || {},
      };
    }

   state.value.status = data.game_result === 'won'
  ? 'won'
  : 'lost';

    state.value.resultSummary = {
      type: data.game_result === 'won' ? 'won' : 'lose',
      message:
        data.game_result === 'won'
          ? '🎉 إجابة صحيحة!'
          : `❌ الجواب الصحيح هو: ${data.entity?.name}`,
    };

    if (data.final_score !== undefined) {
      state.value.score = data.final_score;
    }

    return { gameResult: data.game_result };

  } catch (error) {
    console.error('Error verifying guess:', error);
    return null;
  }
}




  async function giveUp() {
 

    try {
      const response = await api.post('/give-up', {
        session_token: state.value.sessionId,
      });

      const data = response.data.data;
      const entity = data.entity;
      state.value.entity = entity;
      state.value.status = 'lost';
      state.value.resultSummary = {
        type: 'lose',
        message: entity
          ? `❌ الجواب الصحيح هو: ${entity.name}`
          : `❌ انتهت اللعبة!`,
      };

      return entity;

    } catch (error) {
      console.error("Error ending game:", error);
    }
  }

  async function fetchSuggestions(query: string): Promise<any[]> {
    // نتحقق أن الجلسة والـtheme موجودين
    if (!state.value.sessionId || !state.value.selectedTheme) {
      console.warn('No active session or theme for suggestions.');
      return [];
    }

    if (query.trim().length < 2) {
      return [];
    }

    try {
      const response = await api.get('/entities/search', {
        params: {
          session_id: state.value.sessionId,
          q: query.trim(),
          limit: 5,
        },
      });

      const raw = response.data.data || response.data;

      const suggestions = raw.map((item: any) => ({
        id: item.id,
        name: item.name,
        attributes: item.attributes || {},
        image_url:item.image_url || null,
      }));

      return suggestions;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  }

  async function fetchQuestionsBySubCategory(subCategoryId: string): Promise<Question[]> {
    if (!state.value.sessionId) return [];

    try {
      const response = await api.post('/fetch-questions', {
        session_token: state.value.sessionId,
        sub_category_id: subCategoryId,
      });

      const q = response.data.questions;

      state.value.questions = [{
        id: q.question_id,
        text: q.text,
        hint: q.hint,
        options: q.options,
      }];

      state.value.status = 'playing';
      return state.value.questions;

    } catch (error) {
      console.error('Error fetching sub category questions:', error);
      return [];
    }
  }


  async function askQuestion(option: QuestionOption) {
    if (!state.value.sessionId || !canAskQuestion.value) return null;

    try {


      const response = await api.post('/ask-question', {
        session_token: state.value.sessionId,
        option_id: option.id,
      });

      const data = response.data;
      
      const isYes = data.answer === 'yes';

      state.value.conversation.push({
        option,
        answer: isYes
      });

      state.value.questionsAsked += 1;

     
      state.value.categories = response.data.categories;
      state.value.selectedCategory = response.data.categories.filter((cat)=>cat.id === state.value.selectedCategory?.id)[0] || null;


      state.value.questions = [];
    
      state.value.selectedSubCategory = null;
      state.value.status = 'idle';

      return isYes;

    } catch (error) {
      console.error('Error asking option:', error);
      return null;
    }
  }



  function resetTimerForRound() {
    
    state.value.timeRemaining = state.value.selectedLevel?.time_per_attempt || 60; // أو أي قيمة افتراضية
    
  }

  async function fetchNextQuestions(count?: number) {
    if (!state.value.sessionId) return [];

    const questionsCount = count || state.value.selectedLevel?.questions_per_attempt || 4;

    try {
      const response = await api.post('/next-questions', {
        session_token: state.value.sessionId,
        count: questionsCount,
      });

      const data = response.data;
      state.value.questions = data.questions;

      return data.questions;
    } catch (error) {
      console.error('Error fetching next questions:', error);
      return [];
    }
  }
async function submitGuess(guess: string) {
  if (!state.value.sessionId) return;

 

  try {
    const res = await api.post('/verify-guess', {
      session_token: state.value.sessionId,
      guess_name: guess,
    });

    const data = res.data.data;

    state.value.status = data.game_result; // won | lost
    state.value.entity = data.entity;

    state.value.resultSummary = {
      type: data.game_result === 'won' ? 'win' : 'lose',
      message:
        data.game_result === 'won'
          ? '🎉 إجابة صحيحة!'
          : `❌ الجواب الصحيح هو: ${data.entity.name}`,
    };

    return data;

  } catch (e) {
    console.error('submitGuess error', e);
  }
}


async function fetchFinalEntity() {
  console.log('start')
  console.log(state.value.sessionId);
  if (!state.value.sessionId) return null;

  try {
    const res = await api.post('/reveal-entity', {
      session_token: state.value.sessionId,
    });

    const data = res.data.data;

    if (data.entity) {
      state.value.entity = {
        name: data.entity.name,
        image_url: data.entity.image_url,
        attributes: data.entity.attributes || {},
      };

      if (!state.value.loseReason) {
        state.value.loseReason = 'guess_wrong';
      }

      state.value.status = 'lost';
    }

    return state.value.entity;

  } catch (e) {
    console.error('Error fetching final entity:', e);
    return null;
  }
}


function startTimer() {
  // تأكد ما في تايمر شغال
  stopTimer();

  timerInterval = window.setInterval(async () => {
    // إذا اللعبة مش بحالة playing → أوقف التايمر
    if (state.value.status !== 'playing') {
      stopTimer();
      return;
    }

    if (state.value.timeRemaining > 0) {
      state.value.timeRemaining--;
      return;
    }

  if (state.value.timeRemaining <= 0) {
  stopTimer();

  if (state.value.timeUp) return;

  

  state.value.timeUp = true;
  await fetchFinalEntity();
  state.value.status = 'lost'; 
  state.value.loseReason = 'time_up';    

  return;
}
  }, 1000);
}


  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function resetGame() {
   
    const auth = useAuthStore();
    state.value = {
      sessionId: null,
      user: auth.user,
      selectedTheme: null,
      selectedLevel: null,
      questions: [],
      conversation: [],
      questionsAsked: 0,
      subCategoriesLimit: 0,
      timeLimit: 0,
      timeRemaining: 0,
      status: 'idle',
      entity: null,
      score: 0,
    };
  }


  // async function fetchThemes(): Promise<Theme[]> {
  //   const { data, error } = await supabase
  //     .from('themes')
  //     .select('*')
  //     .eq('is_active', true);

  //   if (error) {
  //     console.error('Error fetching themes:', error);
  //     return [];
  //   }

  //   return data || [];
  // }

  async function fetchThemes(): Promise<Theme[]> {
    try {
      const response = await api.get('/themes');
      const rawData = response.data.data || response.data;

      const themes: Theme[] = rawData.map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        icon: item.icon,
        is_coming_soon:item.is_coming_soon,
        image:item.image,
        description: item.description ? item.description : null,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      return themes;
    } catch (error) {
      console.error('Error fetching themes:', error);
      return [];
    }
  }


  async function fetchLevels(): Promise<Level[]> {
    try {
      const res = await api.get('/levels');
      const raw = Array.isArray(res.data) ? res.data : res.data.data;
      return raw as Level[];
    } catch (e) {
      console.error('Error fetching levels:', e);
      return [];
    }
  }




  // async function fetchLeaderboard(themeId?: string, difficulty?: string): Promise<LeaderboardEntry[]> {
  //   let query = supabase
  //     .from('leaderboard')
  //     .select('*')
  //     .order('score', { ascending: false })
  //     .limit(10);

  //   if (themeId) {
  //     query = query.eq('theme_id', themeId);
  //   }

  //   if (difficulty) {
  //     query = query.eq('difficulty', difficulty);
  //   }

  //   const { data, error } = await query;

  //   if (error) {
  //     console.error('Error fetching leaderboard:', error);
  //     return [];
  //   }

  //   return data || [];
  // }

  return {
    state,
    isPlaying,
    fetchFinalEntity,
    categoriesRemaining,
    timeElapsed,
    canAskQuestion,
    startGame,
    askQuestion,
    submitGuess,
    resetGame,
    fetchThemes,
    // fetchLeaderboard,
    fetchLevels,
    fetchNextQuestions,
    resetTimerForRound,
    fetchQuestionsBySubCategory,
    startTimer,
    verifyGuess,
    fetchSuggestions,
    fetchThemeById,
    fetchLevelById,
    fetchUserById,
    giveUp,
    askedQuestionsCount,
    setSelectedGuessEntity,
    clearSelectedGuessEntity,
    isCategoriesLimitReached

  };
});
