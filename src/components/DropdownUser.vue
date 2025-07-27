<template>
    <div class="dropdown-content long">
        <div class="dropdown-section">
            <p>Welcome {{username}}</p>
            <img :src="avatar" alt="User avatar">
        </div>
        <div class="dropdown-section-left">
            <div class="dropdown-option">
                <img src="../assets/profile-icon.svg" alt="Profile icon">
                <p>Profile</p>
            </div>
            <div class="dropdown-option">
                <img src="../assets/achievements-icon.svg" alt="Achievements icon">
                <p>Achievements</p>
            </div>
            <div class="dropdown-option">
                <img src="../assets/settings-icon.svg" alt="Settings icon">
                <p>Settings</p>
            </div>
            <div class="dropdown-option">
                <img src="../assets/help-icon.svg" alt="Help icon">
                <p>Help</p>
            </div>
            <div @click="signOut" class="dropdown-option last">
                <img src="../assets/sign-out-icon.svg" alt="Sign out icon">
                <p>Sign out</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { account, databases } from '@/lib/appwrite';
import { ref, onMounted } from 'vue';
import { Query } from 'appwrite';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const avatar = ref('');
const database_id = process.env.VUE_APP_DATABASE_ID;
const collection_id = process.env.VUE_APP_COLLECTION_ID;

onMounted(async () => {
    try {
        const user = await account.get();
        const userId = user.$id;
        username.value = user.name;

        //searching user by id to find avatar src
        //Query is a class that lets use methods for each type of supported query operation, for example searching if given value is in database (method equal)
        const searchedUser = await databases.listDocuments(database_id,collection_id, [Query.equal('id_user',userId)]);

        if(searchedUser.total > 0) { //checking if databse return any document
            const userDocuments = searchedUser.documents[0]; //given value from first document is assigned to userDocuments variable, so we can get avatar value from it
            avatar.value = userDocuments.avatar;
            //console.log("Img src: ",avatar.value);
        }
    } catch(err) {
        console.log("Error: ",err);
    }
})

async function signOut() {
    try {
         await account.deleteSession('current');
         console.log('Logged out');
         router.push('/');
     } catch (err) {
         console.error('Logout error:', err);
    }
}
</script>

<style lang="scss">
.long {
    height: 420px;
}

.dropdown-content {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      gap: 12px;

      position: absolute;
      width: 300px;
      z-index: 1;
      right: 20px;
      margin-top: 8px;
      border-radius: 6px;
      background-color: rgba(174, 210, 229,0.5);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow:  4px 4px 10px 3px rgba(0,0,0,0.3);

      .dropdown-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        
        p { 
          text-align: center;
          width: 224px;
          font-size: 20px;
        }

        img {
            width: 80px;
            padding: 8px 0px;
        }

      }

    .dropdown-section-left {
        width: 254px;
        display: flex;
        flex-direction: column;
        gap: 12px;

        .dropdown-option {
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid black;
            padding-bottom: 8px;

            img {
                width: 30px;
            }

            p {
                font-size: 18px;
            }
            
        }

        .dropdown-option.last {
            border-bottom: none;
        }
    }
}
</style>