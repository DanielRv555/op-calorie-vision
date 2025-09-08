import type { GoalData } from '../types';

const GOAL_KEY_PREFIX = 'calorie-vision-goals-';

export const getGoals = (username: string): GoalData | null => {
  const userGoalKey = `${GOAL_KEY_PREFIX}${username}`;
  try {
    const goalsJson = localStorage.getItem(userGoalKey);
    if (goalsJson) {
      const goals = JSON.parse(goalsJson);
      // Basic validation
      if (typeof goals.calories === 'number') {
        return goals;
      }
    }
  } catch (error) {
    console.error("Failed to load goals from localStorage", error);
  }
  return null;
};

export const saveGoals = (username: string, goals: GoalData): void => {
  const userGoalKey = `${GOAL_KEY_PREFIX}${username}`;
  try {
    const goalsJson = JSON.stringify(goals);
    localStorage.setItem(userGoalKey, goalsJson);
  } catch (error)
 {
    console.error("Failed to save goals to localStorage", error);
  }
};