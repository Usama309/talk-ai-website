// TALK AI - JavaScript Functionality
// Vapi SDK Integration & Interactive Features

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Vapi SDK Integration for Demo
let vapiInstance = null;
const startCallBtn = document.getElementById('startCallBtn');
const endCallBtn = document.getElementById('endCallBtn');
const callStatus = document.getElementById('callStatus');

if (startCallBtn) {
    startCallBtn.addEventListener('click', async () => {
        try {
            // Initialize Vapi - Replace with your actual public key
            if (!vapiInstance && typeof Vapi !== 'undefined') {
                vapiInstance = new Vapi('YOUR_VAPI_PUBLIC_KEY_HERE');
            }
            
            if (vapiInstance) {
                // Start the call
                await vapiInstance.start({
                    transcriber: {
                        provider: "deepgram",
                        model: "nova-2",
                        language: "en-US"
                    },
                    model: {
                        provider: "openai",
                        model: "gpt-3.5-turbo",
                        messages: [{
                            role: "system",
                            content: "You are a helpful AI assistant for TALK AI. Answer questions about our voice AI platform, pricing, and features. Be friendly and concise."
                        }]
                    },
                    voice: {
                        provider: "11labs",
                        voiceId: "default"
                    }
                });
                
                // Update UI
                startCallBtn.style.display = 'none';
                endCallBtn.style.display = 'inline-block';
                callStatus.textContent = '🔴 Call Active - Speak now!';
                callStatus.style.background = 'rgba(34, 197, 94, 0.2)';
                callStatus.style.color = '#22c55e';
            } else {
                callStatus.textContent = 'Demo: Click "Start Conversation" to talk with our AI (Vapi SDK required)';
                callStatus.style.background = 'rgba(99, 102, 241, 0.2)';
                callStatus.style.color = '#6366f1';
            }
        } catch (error) {
            console.error('Error starting call:', error);
            callStatus.textContent = 'Demo mode: Vapi SDK integration ready. Contact us for API key.';
            callStatus.style.background = 'rgba(99, 102, 241, 0.2)';
            callStatus.style.color = '#6366f1';
        }
    });
}

if (endCallBtn) {
    endCallBtn.addEventListener('click', () => {
        if (vapiInstance) {
            vapiInstance.stop();
        }
        startCallBtn.style.display = 'inline-block';
        endCallBtn.style.display = 'none';
        callStatus.textContent = '';
    });
}

// Signup Form Handler with Referral System
const signupForm = document.getElementById('signupForm');
const referralLink = document.getElementById('referralLink');
const referralLinkInput = document.getElementById('referralLinkInput');

if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const company = document.getElementById('company').value;
        
        // Generate unique referral ID (in production, this would be done server-side)
        const referralId = btoa(email).replace(/=/g, '').substring(0, 12);
        const referralUrl = `${window.location.origin}?ref=${referralId}`;
        
        // Simulate account creation (in production, send to backend)
        console.log('New signup:', { fullName, email, company, referralId });
        
        // Show referral link
        referralLinkInput.value = referralUrl;
        referralLink.style.display = 'block';
        signupForm.style.display = 'none';
        
        // Track commission (30% of subscription cost)
        localStorage.setItem(`referral_${referralId}`, JSON.stringify({
            name: fullName,
            email: email,
            company: company,
            commissionRate: 0.3,
            createdAt: new Date().toISOString()
        }));
    });
}

// Copy Referral Link
const copyLinkBtn = document.getElementById('copyLinkBtn');
if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
        referralLinkInput.select();
        document.execCommand('copy');
        copyLinkBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyLinkBtn.textContent = 'Copy Link';
        }, 2000);
    });
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simulate sending (in production, send to backend/email service)
        console.log('Contact form submission:', data);
        
        alert('Thank you for contacting us! We\'ll get back to you within 24 hours.');
        contactForm.reset();
    });
}

// Check for referral parameter on page load
const urlParams = new URLSearchParams(window.location.search);
const refParam = urlParams.get('ref');
if (refParam) {
    // Track referral visit
    console.log('Visitor from referral:', refParam);
    sessionStorage.setItem('referralSource', refParam);
}
