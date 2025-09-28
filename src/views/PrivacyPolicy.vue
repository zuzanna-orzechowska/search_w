<template>
    <div class="background-container">
        <div class="container">
            <h2 class="title">Privacy Policy</h2>
            
            <div class="policy-content">
                <strong>Privacy Policy</strong>
                <p>This privacy policy applies to the SearchW app (hereby referred to as "Application") for mobile devices that was created by Zuzanna (hereby referred to as "Service Provider") as a Free service. This service is intended for use "AS IS".</p>
                <br>
                <strong>Information Collection and Use</strong>
                <p>The Application collects information when you download and use it. This information may include information such as </p>
                <ul>
                    <li>Your device's Internet Protocol address (e.g. IP address)</li>
                    <li>The pages of the Application that you visit, the time and date of your visit, the time spent on those pages</li>
                    <li>The time spent on the Application</li>
                    <li>The operating system you use on your mobile device</li>
                </ul>
                <p>The Application does not gather precise information about the location of your mobile device.</p>
                
                <div style="display: none;">
                    <br>
                    <p>The Application collects your device's location, which helps the Service Provider determine your approximate geographical location and make use of in below ways:</p>
                    <ul>
                        <li>Geolocation Services: The Service Provider utilizes location data to provide features such as personalized content, relevant recommendations, and location-based services.</li>
                        <li>Analytics and Improvements: Aggregated and anonymized location data helps the Service Provider to analyze user behavior, identify trends, and improve the overall performance and functionality of the Application.</li>
                        <li>Third-Party Services: Periodically, the Service Provider may transmit anonymized location data to external services. These services assist them in enhancing the Application and optimizing their offerings.</li>
                    </ul>
                </div>
                <br>
                
                <p>The Service Provider may use the information you provided to contact you from time to time to provide you with important information, required notices and marketing promotions.</p>
                <br>
                <p>For a better experience, while using the Application, the Service Provider may require you to provide us with certain personally identifiable information, including but not limited to email, name, username. The information that the Service Provider request will be retained by them and used as described in this privacy policy.</p>
                <br>
                
                <strong>Third Party Access</strong>
                <p>Only aggregated, anonymized data is periodically transmitted to external services to aid the Service Provider in improving the Application and their service. The Service Provider may share your information with third parties in the ways that are described in this privacy statement.</p>
                <br>
                <p>The Service Provider may disclose User Provided and Automatically Collected Information:</p>
                <ul>
                    <li>as required by law, such as to comply with a subpoena, or similar legal process;</li>
                    <li>when they believe in good faith that disclosure is necessary to protect their rights, protect your safety or the safety of others, investigate fraud, or respond to a government request;</li>
                    <li>with their trusted services providers who work on their behalf, do not have an independent use of the information we disclose to them, and have agreed to adhere to the rules set forth in this privacy statement.</li>
                </ul>
                <br>
                
                <strong>Opt-Out Rights</strong>
                <p>You can stop all collection of information by the Application easily by uninstalling it. You may use the standard uninstall processes as may be available as part of your mobile device or via the mobile application marketplace or network.</p>
                <br>
                
                <strong>Data Retention Policy</strong>
                <p>The Service Provider will retain User Provided data for as long as you use the Application and for a reasonable time thereafter. If you'd like them to delete User Provided Data that you have provided via the Application, please contact them at <a href="mailto:orzechosiaa.searchw@gmail.com">orzechosiaa.searchw@gmail.com</a> and they will respond in a reasonable time.</p>
                <br>
                
                <strong>Children</strong>
                <p>The Service Provider does not use the Application to knowingly solicit data from or market to children under the age of 13.</p>
                <br>
                <div>
                    <p>The Service Provider does not knowingly collect personally identifiable information from children. The Service Provider encourages all children to never submit any personally identifiable information through the Application and/or Services. The Service Provider encourage parents and legal guardians to monitor their children's Internet usage and to help enforce this Policy by instructing their children never to provide personally identifiable information through the Application and/or Services without their permission. If you have reason to believe that a child has provided personally identifiable information to the Service Provider through the Application and/or Services, please contact the Service Provider (<a href="mailto:orzechosiaa.searchw@gmail.com">orzechosiaa.searchw@gmail.com</a>) so that they will be able to take the necessary actions. You must also be at least 16 years of age to consent to the processing of your personally identifiable information in your country (in some countries we may allow your parent or guardian to do so on your behalf).</p>
                </div>
                <br>
                
                <strong>Security</strong>
                <p>The Service Provider is concerned about safeguarding the confidentiality of your information. The Service Provider provides physical, electronic, and procedural safeguards to protect information the Service Provider processes and maintains.</p>
                <br>
                
                <strong>Changes</strong>
                <p>This Privacy Policy may be updated from time to time for any reason. The Service Provider will notify you of any changes to the Privacy Policy by updating this page with the new Privacy Policy. You are advised to consult this Privacy Policy regularly for any changes, as continued use is deemed approval of all changes.</p>
                <br>
                
                <p>This privacy policy is effective as of 2025-09-28</p>
                <br>
                
                <strong>Your Consent</strong>
                <p>By using the Application, you are consenting to the processing of your information as set forth in this Privacy Policy now and as amended by us.</p>
                <br>
                
                <strong>Contact Us</strong>
                <p>If you have any questions regarding privacy while using the Application, or have questions about the practices, please contact the Service Provider via email at <a href="mailto:orzechosiaa.searchw@gmail.com">orzechosiaa.searchw@gmail.com</a>.</p>
                
                <hr>
                <p class="generator-credit">This privacy policy page was generated by <a href="https://app-privacy-policy-generator.nisrulz.com/" target="_blank" rel="noopener noreferrer">App Privacy Policy Generator</a></p>
                <div class="bottom">
                    <img @click="goBack" src="../assets/home-icon.svg" alt="home icon">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
function goBack() {
    router.back();
}
</script>

<style lang="scss" scoped>
$bg-color: rgb(174, 210, 229);
$text-color: #333;

.background-container {
    background-color: $bg-color;
    min-height: 100dvh; 
    width: 100%;
    display: flex;
    justify-content: center;
    overflow-y: auto; 
}

.container {
    position: relative;
    background-color: $bg-color;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%; 
    max-width: 900px; 
    padding: 20px;
    box-sizing: border-box; 
    align-items: flex-start; 
    
    
    h2.title {
        font-size: 56px;
        font-weight: 500;
        margin-bottom: 32px;
        margin-top: 12px;
        width: 100%;
        text-align: center;
        color: $text-color;
    }
}

.policy-content {
    width: 100%;
    position: relative;
    max-width: 800px;
    margin: 0 auto;
    font-size: 16px;
    line-height: 1.6;
    color: $text-color;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .bottom{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 32px;
        background-color: #57A4CD;
        width: 280px;
        height: auto;
        border: 4px solid black;
        border-radius: 24px;
        gap: 24px;
    
        img{
            width: 44px;
            cursor: pointer;
            margin-top: 0;
        }
    }

    strong {
        display: block;
        font-size: 1.15em;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
        color: #000;
    }

    p {
        margin-bottom: 0.8em;
    }

    ul {
        margin-bottom: 1em;
        padding-left: 25px;
    }
    
    li {
        margin-bottom: 0.3em;
    }

    a {
        color: #007bff; 
        text-decoration: underline;
        -webkit-tap-highlight-color: transparent;
        -webkit-text-fill-color: initial;
    }

    hr {
        border: 0;
        height: 1px;
        background: $text-color;
        margin: 20px 0;
        opacity: 0.2;
    }

    .generator-credit {
        font-size: 0.85em;
        text-align: center;
        margin-top: 10px;
    }
}
</style>
