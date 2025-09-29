import { defineStore } from 'pinia';
import { databases, account } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { levelData } from '@/lib/levelsData';
import { toast } from 'vue3-toastify';

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    verificationEmail: '',
    avatar: '',
    username: '',
    title: '',
    level: 0,
    coins: 0,
    xp: 0,
    userAchievements: [],
    userAvatars: [],
    userDocId: null,
    userStatsDocId: null
  }),
  getters: {
  },
  actions: {
    setVerificationEmail(email) {
      this.verificationEmail = email;
    },
    async fetchUser() {
      try {
        this.currentUser = await account.get();
        return this.currentUser;
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    },

    async fetchUserData(database_id, collection_id, collection_user_stats_id, collection_user_avatars_id, collection_user_achievements_id) {
      try {
        const userId = this.currentUser.$id;

        const [userData, userDataProgress, userPurchasedAvatars, userAchievementsData] = await Promise.all([
          databases.listDocuments(database_id, collection_id, [Query.equal('id_user', userId)]),
          databases.listDocuments(database_id, collection_user_stats_id, [Query.equal('user_id', userId)]),
          databases.listDocuments(database_id, collection_user_avatars_id, [Query.equal('user_id', userId)]),
          databases.listDocuments(database_id, collection_user_achievements_id, [Query.equal('user_id', userId)])
        ]);

        if (userData.total > 0) {
          const doc = userData.documents[0];
          this.userDocId = doc.$id;
          this.avatar = doc.avatar;
          this.username = doc.username;
          this.userAvatars = [doc.avatar];
        }

        if (userDataProgress.total > 0) {
          const stats = userDataProgress.documents[0];
          this.userStatsDocId = stats.$id;
          this.title = stats.title;
          this.level = stats.level;
          this.coins = stats.coin;
          this.xp = stats.xp;
          await this.levelUpSystem(database_id, collection_user_stats_id);
        }

        const allAvatars = new Set(this.userAvatars);
        if (userPurchasedAvatars.total > 0) {
          const avatarsDoc = userPurchasedAvatars.documents[0];
          if (avatarsDoc.initial_avatar) allAvatars.add(avatarsDoc.initial_avatar);
          if (avatarsDoc.purchased_avatars) avatarsDoc.purchased_avatars.forEach(av => allAvatars.add(av));
        }
        this.userAvatars = Array.from(allAvatars);

        const allAchievements = new Set();
        if (userAchievementsData.total > 0) {
          const achDoc = userAchievementsData.documents[0];
          if (achDoc.achievements) achDoc.achievements.forEach(a => allAchievements.add(a));
        }
        this.userAchievements = Array.from(allAchievements);

      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    },

     async levelUpSystem(database_id, collection_user_stats_id) {
      const sortedLevels = [...levelData].sort((a, b) => b.xpNeeded - a.xpNeeded);
      const newLevelData = sortedLevels.find(l => l.xpNeeded <= this.xp);
      if (newLevelData && newLevelData.number > this.level && this.userStatsDocId) {
        const newLevel = newLevelData.number;
        const newTitle = newLevelData.title;
        try {
          await databases.updateDocument(database_id, collection_user_stats_id, this.userStatsDocId, { level: newLevel, title: newTitle });
          this.level = newLevel;
          this.title = newTitle;
        } catch (err) {
          console.error("Error updating user stats document:", err);
        }
      }
    },

    async saveUsername(newUsername) {
      if (!newUsername || newUsername === this.username) {
        toast.info("Username is already the same.");
        return;
      }
      try {
        const check = await databases.listDocuments(process.env.VUE_APP_DATABASE_ID, process.env.VUE_APP_COLLECTION_ID, [Query.equal('username', newUsername)]);
        if (check.total > 0) {
          toast.error("This username is already in use.");
          return;
        }
        if (newUsername.length > 21) {
          toast.info("Username can't be longer than 21 characters!");
          return;
        }
        await account.updateName(newUsername);
        await databases.updateDocument(process.env.VUE_APP_DATABASE_ID, process.env.VUE_APP_COLLECTION_ID, this.userDocId, { username: newUsername });
        this.username = newUsername;
        toast.success("Username updated successfully!");
      } catch (err) {
        console.error("Error updating username:", err);
        toast.error("Failed to update username.");
      }
    },

    async selectAvatar(newAvatarSource) {
      if (!newAvatarSource || newAvatarSource === this.avatar) return;
      try {
        await databases.updateDocument(process.env.VUE_APP_DATABASE_ID, process.env.VUE_APP_COLLECTION_ID, this.userDocId, { avatar: newAvatarSource });
        this.avatar = newAvatarSource;
        toast.success("Avatar updated successfully!");
      } catch (err) {
        console.error("Error updating avatar:", err);
        toast.error("Failed to update avatar.");
      }
    },

  }
});
