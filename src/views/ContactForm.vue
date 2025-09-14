<template>
    <img src="../assets/linesTopBottom.png" alt="drawing of lines" class="lines-top-bottom-login">
    <main>
        <div class="wrapper-login">
            <h2>Contact</h2>
            <form action="https://formspree.io/f/xvgbngva" method="post">
                <div class="form-group">
                    <label for="userName" class="form-label">Name or username *</label>
                    <input type="text" id="userName" name="userName" placeholder="Name or username" v-model="userName" autocomplete="off" required>
                </div>

                <div class="form-group">
                    <label for="userEmail" class="form-label">E-mail *</label>
                    <input type="email" id="userEmail" name="userEmail" placeholder="Email" v-model="userEmail" autocomplete="off" required>
                </div>

                <div class="form-group">
                    <label for="topic" class="form-label">Topic</label>
                    <input type="text" id="topic" name="topic" placeholder="Topic" v-model="topic" autocomplete="off">
                </div>

                <div class="form-group">
                    <label for="message" class="form-label">Message</label>
                    <textarea id="message" name="message" placeholder="Tell me what's bothering you..." v-model="message" rows="5"></textarea>
                </div>
                
                <div class="form-agreement">
                    <input type="checkbox" name="userAgreed" id="agreement" v-model="agree" required>
                    <label for="agreement">I consent to the storage and use of the information I provide for contact purposes.</label>
                </div>

                <button type="submit" class="userButton">Send</button>
            </form>
        </div>
    </main>
</template>
<script setup>
</script>

<style lang="scss">
main {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f9f9f9;

    .wrapper-login {
        width: 100%;
        max-width: 500px;
        padding: 40px;
        background-color: rgba(174, 210, 229, 0.5);
        border-radius: 6px;
        box-shadow: 4px 4px 10px 3px rgba(0, 0, 0, 0.3);
        z-index: 0;
    }

    h2 {
        font-size: 64px;
        text-align: center;
        margin-top: 116px;
        margin-bottom: 44px;
        font-weight: 450;
    }
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%; 
    }

    .form-label {
        font-weight: 500;
        text-align: left;
    }

    input[type="text"],
    input[type="email"],
    textarea {
        width: 100%;
        font-size: 1.1rem; // Reduced font size for better fit
        background-color: #6AAED3;
        border: none;
        border-radius: 12px; // Slightly smaller border-radius
        height: 3.2rem; // Slightly reduced height
        padding: 0.8rem 1rem; // Adjusted padding
        color: #f9f9f9;
        transition: all 0.3s ease;
        box-sizing: border-box;
    }

    textarea {
        height: auto;
        min-height: 120px; // Increased min-height for better text input area
        resize: vertical;
        padding-top: 0.8rem; // Consistent padding
    }

    input::placeholder,
    textarea::placeholder {
        color: rgba(249, 249, 249, 0.82);
        font-weight: 300;
    }

    input:focus,
    textarea:focus {
        border: 2px solid #2A8DC1; // Adjusted border thickness
        outline: none;
        box-shadow: 0 0 8px rgba(#2A8DC1, 0.5); // Added a subtle glow effect on focus
    }
}

// Checkbox and Agreement Styles
.form-agreement {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    width: 100%; // Make the checkbox container span the full width
}

// Button Styles
.userButton {
    margin-top: 2rem;
    font-size: 1.2rem; // Slightly smaller font
    padding: 0.8rem 2rem; // Adjusted padding for a smaller button
    font-weight: 500;
    background-color: #2A8DC1;
    color: white;
    border: none; // Removed the border for a cleaner look
    border-radius: 6px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); // Added a subtle shadow
    width: 50%; // Make the button a specific width for better centering and proportion
    align-self: center;
}

.userButton:hover {
    box-shadow: 0px 8px 15px -4px rgba(8, 73, 111, 0.6); // Enhanced hover shadow
    transform: translateY(-2px); // A subtle lift effect
}
</style>