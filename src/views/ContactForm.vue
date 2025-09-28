<template>
    <main>
        <div class="wrapper-form">
            <h2>Contact</h2>
            <form action="https://formspree.io/f/xvgbngva" method="post">
                <div class="form-group">
                    <label for="userName" class="form-label">Name or username *</label>
                    <input type="text" id="userName" name="userName" placeholder="Name or username" autocomplete="off" required>
                </div>
                
                <div class="form-group">
                    <label for="userEmail" class="form-label">E-mail *</label>
                    <input type="email" id="userEmail" name="userEmail" placeholder="Email" autocomplete="off" required>
                </div>
                
                <div class="form-group">
                    <label for="topic" class="form-label">Topic</label>
                    <input type="text" id="topic" name="topic" placeholder="Topic" autocomplete="off">
                </div>
                
                <div class="form-group">
                    <label for="message" class="form-label">Message</label>
                    <textarea id="message" name="message" placeholder="Tell me what's bothering you..." rows="5"></textarea>
                </div>
                
                <div class="form-agreement">
                    <input type="checkbox" name="userAgreed" id="agreement" required>
                    <label for="agreement">I consent to the storage and use of the information I provide for contact purposes.</label>
                </div>
                
                <button type="submit" class="userButton">Send</button>
            </form>
        </div>
    </main>
</template>

<script setup>
</script>

<style lang="scss" scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f9f9f9;
    width: 100%;

    .wrapper-form {
        width: 50%;
        background-color: rgba(174, 210, 229,0.5);
        height: 672px;
        border-radius: 6px;
        box-shadow:  4px 4px 10px 3px rgba(0,0,0,0.3);
    }

    h2 {
        font-size: 64px;
        text-align: center;
        margin: 16px 0px;
        font-weight: 450;
    }
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 80%; 
    }

    .form-label {
        font-weight: 500;
        text-align: left;
    }

    input[type="text"],input[type="email"],textarea {
        width: 100%;
        font-size: 1.1rem;
        background-color: #6AAED3;
        border: none;
        border-radius: 12px;
        height: 3rem;
        padding: 0.6rem 0.8rem;
        color: #f9f9f9;
        transition: all 0.3s ease;
        box-sizing: border-box;
    }

    textarea {
        height: auto;
        resize: vertical;
        padding-top: 0.6rem;
    }

    input::placeholder,textarea::placeholder {
        color: rgba(249, 249, 249, 0.82);
        font-weight: 300;
    }

    input:focus,textarea:focus {
        border: 2px solid #2A8DC1;
        outline: none;
        box-shadow: 0 0 8px rgba(#2A8DC1, 0.5);
    }
}

.form-agreement {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.875rem;
    width: 80%;
}

.userButton {
    margin-top: 0.5rem;
    font-size: 1.2rem; 
    padding: 0.6rem 0.8rem;
    font-weight: 500;
    background-color: #2A8DC1;
    border: 2px solid black;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 20%;
}

.userButton:hover {
    box-shadow: 0px 8px 15px -4px rgba(8, 73, 111, 0.6);
    transform: translateY(-2px);
}

@media (max-width: 600px) {
    main {
        width: 100vw;
        padding: 0;
    }

    .wrapper-form {
        width: 95% !important;
        height: 642px !important;
        box-shadow: none;
    }

    h2 {
        font-size: 48px;
        margin: 30px 0 20px 0;
    }

    form {
        gap: 1.2rem;

        .form-group {
            width: 90%;
            gap: 0.3rem;
        }

        .form-label {
            font-size: 1.1rem;
        }

        input[type="text"],input[type="email"],textarea {
            font-size: 1rem;
            height: 2.8rem; 
            padding: 0.5rem 0.7rem;
        }

        .form-agreement {
            width: 90%;
            gap: 0.5rem;
            font-size: 0.875rem; 
            align-items: center; 
        }
    }

    .userButton {
        width: 60%; 
        font-size: 1.2rem; 
        padding: 0.8rem 1rem;
        margin-top: 1.5rem;
    }
}
</style>