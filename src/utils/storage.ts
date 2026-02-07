export interface AvatarStats {
    health: number;
    mana: number;
    mood: number;
}

export type MoodState = 'happy' | 'sad' | 'excited' | 'sleepy';
export type GrowthStage = 'child' | 'teen' | 'adult';

export interface AvatarData {
    id: string;
    name: string;
    image: string;
    style: string;
    voxelCode?: string;
    stats: AvatarStats;
    currentMoodState: MoodState;
    createdAt: number;
    lastDailyUpdate?: number;
    lastPlayedAt?: number;
    quizCompleted?: boolean;
    // Growth System
    level: number;
    xp: number;
    maxXp: number;
    stage: GrowthStage;
    // Inventory
    apples: number;
    isDead?: boolean;
}

const STORAGE_KEY = 'grow_your_avatar_data';

export const saveAvatar = (avatar: AvatarData): void => {
    const avatars = getAllAvatars();
    const existingIndex = avatars.findIndex(a => a.id === avatar.id);

    if (existingIndex > -1) {
        avatars[existingIndex] = avatar;
    } else {
        avatars.push(avatar);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(avatars));
};

export const getAllAvatars = (): AvatarData[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error('Failed to parse avatar data', e);
        return [];
    }
};

export const getAvatarById = (id: string): AvatarData | undefined => {
    return getAllAvatars().find(a => a.id === id);
};

export const deleteAvatar = (id: string): void => {
    const avatars = getAllAvatars().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(avatars));
};

export const createInitialStats = (): AvatarStats => ({
    health: 5,
    mana: 5,
    mood: 5
});

export const getInitialGrowthStats = () => ({
    level: 1,
    xp: 0,
    maxXp: 100,
    stage: 'child' as GrowthStage,
    apples: 5
});

/**
 * Handles logic for Scenario 2: Earning HP after Quiz + Game
 */
export const completeGameSession = (avatarId: string): { rewarded: boolean; leveledUp?: boolean } => {
    const avatar = getAvatarById(avatarId);
    if (!avatar) {
        return { rewarded: false };
    }

    let rewarded = false;
    let leveledUp = false;
    let updatedAvatar = { ...avatar };

    // Initialize growth stats if missing (migration)
    if (updatedAvatar.level === undefined) {
        Object.assign(updatedAvatar, getInitialGrowthStats());
    }
    // Initialize apples if missing (migration)
    if (updatedAvatar.apples === undefined) {
        updatedAvatar.apples = 5;
    }

    // Scenario 2: Award rewards for completing game
    // if (avatar.quizCompleted) {
    updatedAvatar.stats = {
        ...avatar.stats,
        health: Math.min(5, avatar.stats.health + 1)
    };
    updatedAvatar.quizCompleted = false; // Reset for next session

    // Award XP
    const xpResult = calculateXpGain(updatedAvatar, 50); // 50 XP for completing a session
    updatedAvatar = xpResult.avatar;
    leveledUp = xpResult.leveledUp;

    // Award Apple
    updatedAvatar.apples = (updatedAvatar.apples || 0) + 2;

    rewarded = true;
    // }

    // Mark as played to prevent Scenario 1 penalty
    updatedAvatar.lastPlayedAt = Date.now();

    saveAvatar(updatedAvatar);
    return { rewarded, leveledUp };
};

export const addExperience = (avatarId: string, amount: number): { avatar: AvatarData | undefined, leveledUp: boolean } => {
    const avatar = getAvatarById(avatarId);
    if (!avatar) return { avatar: undefined, leveledUp: false };

    const result = calculateXpGain(avatar, amount);
    saveAvatar(result.avatar);
    return { avatar: result.avatar, leveledUp: result.leveledUp };
};

// Helper to calculate XP without saving (pure-ish)
const calculateXpGain = (avatar: AvatarData, amount: number): { avatar: AvatarData, leveledUp: boolean } => {
    let updatedAvatar = { ...avatar };

    // Safety check for migration
    if (updatedAvatar.level === undefined) {
        Object.assign(updatedAvatar, getInitialGrowthStats());
    }

    updatedAvatar.xp += amount;
    let leveledUp = false;

    // Level Up Loop
    while (updatedAvatar.xp >= updatedAvatar.maxXp) {
        updatedAvatar.xp -= updatedAvatar.maxXp;
        updatedAvatar.level += 1;
        updatedAvatar.maxXp = Math.floor(updatedAvatar.maxXp * 1.5); // Harder to level up
        leveledUp = true;
    }

    // Update Stage based on Level
    if (updatedAvatar.level >= 10) {
        updatedAvatar.stage = 'adult';
    } else if (updatedAvatar.level >= 5) {
        updatedAvatar.stage = 'teen';
    } else {
        updatedAvatar.stage = 'child';
    }

    return { avatar: updatedAvatar, leveledUp };
};
