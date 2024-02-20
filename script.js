const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('.chat-input span');
const chatbox = document.querySelector('.chatbox');
const chatbotToggler = document.querySelector('.chatbot-toggler');
const chatbotCloseBtn = document.querySelector('.close-btn');

// import API_URL from file "./api_url.js";
import { API_URL, API_KEY } from "./api_url.js";
let userMessage;

const inputInitHeight = chatInput.scrollHeight;

const createChatli = (message, className) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector('p').textContent = message;
    return chatLi;
};

const generateRespond = (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector('p');
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                // {
                //     role: "system",
                //     content: "You are a helpful assistant."
                // },
                {
                    role: "user",
                    content: userMessage
                }
            ]
        })
    };
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch(error => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again later or contact the developer.";
    }).finally(() => {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    });
};

const handleChat = () => {
    userMessage = chatInput.value.trim();

    if (!userMessage) {
        return;
    }
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatli(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    setTimeout(() => {
        const incomingChatLi = createChatli("Wait me...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateRespond(incomingChatLi);
    }, 300);
};

chatInput.addEventListener('input', () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;

});

chatInput.addEventListener('keydown', (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 768) {
        e.preventDefault();
        handleChat();
    }

});

chatbotToggler.addEventListener('click', () => {
    document.body.classList.toggle('show-chatbot');
});

chatbotCloseBtn.addEventListener('click', () => {
    document.body.classList.remove('show-chatbot');
});

sendChatBtn.addEventListener('click', handleChat);