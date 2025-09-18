import { databases, account } from './appwrite';
import { Query, ID } from 'appwrite';
import { toast } from 'vue3-toastify';
import achievements from './achievements';
import categories from './categoriesPlay';
import challenges from './categoriesChallenge';

const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_user_achievements_id = process.env.VUE_APP_COLLECTION_USER_ACHIEVEMENTS_ID;

export async function handleAchievements(userStats) {
    try {
        const currentUser = await account.get();

        // user's current achievements
        const userAchievementsDoc = await databases.listDocuments(database_id,collection_user_achievements_id,[Query.equal('user_id', currentUser.$id)]);
        let unlockedAchievements = userAchievementsDoc.documents[0]?.achievements || [];
        let docId = userAchievementsDoc.documents[0]?.$id;

        //checking for new achievements
        for (const achievement of achievements) {
            //skip if the user already has this achievement
            if (unlockedAchievements.includes(achievement.name)) {continue;}

            let isUnlocked = false;

            //achievement-specific conditions
            switch (achievement.name) {
                //coins related achievements
                case 'pocket_change':
                    if (userStats.coins >= 500) {
                        isUnlocked = true;
                    }
                    break;
                case 'treasure_hunter':
                    if (userStats.coins >= 1500) {
                        isUnlocked = true;
                    }
                    break;
                case 'word_tycoon':
                    if (userStats.coins >= 3330) {
                        isUnlocked = true;
                    }
                    break;

                //level related achievements
                case 'first_steps':
                    if (userStats.level === 1) {
                        isUnlocked = true;
                    }
                    break;
                case 'word_explorer':
                    if (userStats.level === 10) {
                        isUnlocked = true;
                    }
                    break;
                case 'puzzle_master':
                    if (userStats.level === 15) {
                        isUnlocked = true;
                    }
                    break;
                case 'legend_of_letters':
                    if (userStats.level === 20) {
                        isUnlocked = true;
                    }
                    break;

                //play puzzles related achievements:
                case 'category_conqueror':
                    if (userStats.completedCategoriesCount >= 1) {
                        isUnlocked = true;
                    }
                    break;
                case 'puzzle_librarian': {
                    const totalPlayCategories = categories.length; 
                    if (userStats.completedCategoriesCount >= Math.floor(totalPlayCategories / 2)) {
                        isUnlocked = true;
                    }
                    break;
                }
                case 'hero_of_play': {
                    const totalPlayCategories2 = categories.length;
                    if (userStats.completedCategoriesCount === totalPlayCategories2) {
                        isUnlocked = true;
                    }
                    break;
                }

                //challenge related achievements
                case 'challenger':
                    if (userStats.completedChallengesCount >= 1) {
                        isUnlocked = true;
                    }
                    break;
                case 'fearless_solver':{
                    const totalChallenges = challenges.length; 
                    if (userStats.completedChallengesCount >= Math.floor(totalChallenges / 2)) {
                        isUnlocked = true;
                    }
                    break;
                }
                case 'challenge_champion': {
                    const totalChallenges2 = challenges.length;
                    if (userStats.completedChallengesCount === totalChallenges2) {
                        isUnlocked = true;
                    }
                    break;
                }

                //avatars related achievements:
                case 'fashion_forward':
                    if (userStats.avatarsPurchased === 3) {
                        isUnlocked = true;
                    }
                    break;
                case 'wardrobe_warrior':
                    if (userStats.avatarsPurchased === 10) {
                        isUnlocked = true;
                    }
                    break;
                case 'master_of_disguise':
                    if (userStats.avatarsPurchased === 30) {
                        isUnlocked = true;
                    }
                    break;
            }
            

            //if a new achievement is unlocked, update the database and notify the user
            if (isUnlocked) {
                const newAchievementsArray = [...unlockedAchievements, achievement.name];
                
                if (docId) {
                    await databases.updateDocument(database_id,collection_user_achievements_id,docId,{ achievements: newAchievementsArray });
                } else {
                    //creating a new document if one doesn't exist
                    await databases.createDocument(database_id,collection_user_achievements_id,ID.unique(),{user_id: currentUser.$id,achievements: newAchievementsArray});
                }
                
                toast.success(`You gained a new achievement: "${achievement.description}"`);
                unlockedAchievements = newAchievementsArray; //updating locally to prevent re-checking
            }
        }
    } catch (err) {
        console.error("Error checking achievements:", err);
    }
}