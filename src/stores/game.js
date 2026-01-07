import { defineStore } from 'pinia';
import { databases, account } from '@/lib/appwrite';
import { Query, ID } from 'appwrite';
import { levelData } from '@/lib/levelsData';
import { handleAchievements } from '@/lib/achievementsHandler';
import { useUserStore } from './user';

export const useGameStore = defineStore('game', {
  state: () => ({
    dbId: process.env.VUE_APP_DATABASE_ID,
    collPlay: process.env.VUE_APP_COLLECTION_PLAY_ID,
    collChallenge: process.env.VUE_APP_COLLECTION_CHALLENGE_ID,
    collProgPlay: process.env.VUE_APP_COLLECTION_PROGRESS_PLAY_ID,
    collProgChallenge: process.env.VUE_APP_COLLECTION_PROGRESS_CHALLENGE_ID,
    collStats: process.env.VUE_APP_COLLECTION_USER_STATS_ID,
  }),

  actions: {
    async fetchPuzzleData(category, isChallenge = false) {
      const collection = isChallenge ? this.collChallenge : this.collPlay;
      try {
        const data = await databases.listDocuments(this.dbId, collection, [
          Query.equal("title", category)
        ]);
        return data.documents;
      } catch (err) {
        console.error("GameStore: fetchPuzzleData error", err);
        return [];
      }
    },

    async updateUserStats(coinsGained, xpGained) {
      const userStore = useUserStore();
      try {
        const user = await account.get();
        const stats = await databases.listDocuments(this.dbId, this.collStats, [
          Query.equal('user_id', user.$id)
        ]);

        if (stats.total > 0) {
          const doc = stats.documents[0];
          let { coin, xp, level, title } = doc;

          const newCoins = coin + coinsGained;
          const newXp = xp + xpGained;

          const sortedLevels = [...levelData].sort((a, b) => b.xpNeeded - a.xpNeeded);
          const nextLevel = sortedLevels.find(l => l.xpNeeded <= newXp);

          if (nextLevel && nextLevel.number > level) {
            level = nextLevel.number;
            title = nextLevel.title;
          }

          await databases.updateDocument(this.dbId, this.collStats, doc.$id, {
            coin: newCoins,
            xp: newXp,
            level,
            title
          });

          await handleAchievements({ coins: newCoins, level });

          userStore.coins = newCoins;
          userStore.xp = newXp;
          userStore.level = level;
          userStore.title = title;
          
          return { newCoins, level };
        }
      } catch (err) {
        console.error("GameStore: updateUserStats error", err);
      }
    },

    async savePlayProgress(userId, category, stagesData) {
      try {
        const progressDocs = await databases.listDocuments(this.dbId, this.collProgPlay, [
          Query.equal("user_id", userId),
          Query.equal("category", category)
        ]);

        if (progressDocs.total > 0) {
          await databases.updateDocument(this.dbId, this.collProgPlay, progressDocs.documents[0].$id, {
            stages_data: JSON.stringify(stagesData)
          });
        } else {
          await databases.createDocument(this.dbId, this.collProgPlay, ID.unique(), {
            user_id: userId,
            category,
            stages_data: JSON.stringify(stagesData)
          });
        }
      } catch (err) {
        console.error("GameStore: savePlayProgress error", err);
      }
    },

    async saveChallengeProgress(userId, category, challengeData) { 
      try {
        const progressDocs = await databases.listDocuments(this.dbId, this.collProgChallenge, [
          Query.equal('user_id', userId),
          Query.equal('category', category)
        ]);

        if (progressDocs.total > 0) {
          const doc = progressDocs.documents[0];
          const currentBest = JSON.parse(doc.challenge_data);

          if (challengeData.best_time < currentBest.best_time) {
            await databases.updateDocument(this.dbId, this.collProgChallenge, doc.$id, {
              challenge_data: JSON.stringify(challengeData) 
            });
          }
        } else {
          await databases.createDocument(this.dbId, this.collProgChallenge, ID.unique(), {
            user_id: userId,
            category,
            challenge_data: JSON.stringify(challengeData)
          });
        }
      } catch (err) {
        console.error("GameStore: saveChallengeProgress error", err);
      }
    }
  }
});