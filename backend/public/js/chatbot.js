document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');
    const quickQuestions = document.querySelectorAll('.quick-question');

    // Handle form submission
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = messageInput.value.trim();
        if (message) {
            sendMessage(message);
        }
    });

    // Handle quick questions
    quickQuestions.forEach(button => {
        button.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            sendMessage(question);
        });
    });

    // Send message function
    async function sendMessage(message) {
        if (!message.trim()) return;

        // Add user message to chat
        addMessage(message, 'user');
        messageInput.value = '';
        
        // Disable send button and show typing
        sendButton.disabled = true;
        showTypingIndicator();

        try {
            const response = await fetch('/assistant/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            
            // Hide typing indicator
            hideTypingIndicator();

            if (data.success) {
                addMessage(data.response, 'bot');
            } else {
                addMessage(data.error || 'Sorry, something went wrong. Please try again.', 'bot');
            }
        } catch (error) {
            hideTypingIndicator();
            addMessage('Sorry, I\'m having trouble connecting. Please try again later.', 'bot');
        } finally {
            sendButton.disabled = false;
            messageInput.focus();
        }
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-container ${sender}-message mb-3`;
        
        const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="d-flex align-items-start">
                    <div class="avatar me-2">
                        <div class="rounded-circle bg-primary d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                            <i class="fas fa-user text-white"></i>
                        </div>
                    </div>
                    <div class="message-content">
                        <div class="message-bubble p-3 rounded shadow-sm">
                            ${escapeHtml(text)}
                        </div>
                        <small class="text-muted message-time">${currentTime}</small>
                    </div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="d-flex align-items-start">
                    <div class="avatar me-2">
                        <div class="rounded-circle bg-primary d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                            <i class="fas fa-robot text-white"></i>
                        </div>
                    </div>
                    <div class="message-content">
                        <div class="message-bubble bg-white p-3 rounded shadow-sm">
                            ${escapeHtml(text)}
                        </div>
                        <small class="text-muted message-time">${currentTime}</small>
                    </div>
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator message-container bot-message mb-3';
        typingDiv.innerHTML = `
            <div class="d-flex align-items-start">
                <div class="avatar me-2">
                    <div class="rounded-circle bg-primary d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                        <i class="fas fa-robot text-white"></i>
                    </div>
                </div>
                <div class="message-content">
                    <div class="message-bubble bg-white p-3 rounded shadow-sm">
                        <div class="d-flex align-items-center">
                            <span class="me-2">Typing</span>
                            <div class="dot me-1"></div>
                            <div class="dot me-1"></div>
                            <div class="dot"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        typingDiv.style.display = 'block';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Escape HTML to prevent XSS
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Auto-focus message input
    messageInput.focus();

    // Handle Enter key in input
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });
});