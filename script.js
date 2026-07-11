// ── SCROLL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── PLAN TABS ──
function switchPlan(btn, goal) {
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.plan-grid').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('plan-' + goal).classList.add('active');
}

// ── CHAT STATE ──
let currentGoal = 'bulk';
let conversationHistory = [];
let isLoading = false;

function setGoal(btn, goal) {
  document.querySelectorAll('.gpill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  currentGoal = goal;
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function quickSend(text) {
  document.getElementById('chatInput').value = text;
  sendMessage();
}

function addBubble(text, role) {
  const body = document.getElementById('chatBody');
  const div = document.createElement('div');
  div.className = 'cmsg ' + (role === 'user' ? 'user-msg' : 'coach-msg');
  div.textContent = text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function addThinking() {
  const body = document.getElementById('chatBody');
  const div = document.createElement('div');
  div.className = 'cmsg thinking-msg';
  div.id = 'thinkingBubble';
  div.innerHTML = '<div class="tdots"><span></span><span></span><span></span></div> Thinking...';
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function removeThinking() {
  const t = document.getElementById('thinkingBubble');
  if (t) t.remove();
}

async function sendMessage() {
  if (isLoading) return;
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';
  document.getElementById('sendBtn').disabled = true;
  isLoading = true;

  addBubble(text, 'user');
  conversationHistory.push({ role: 'user', content: text });
  addThinking();

  const goalDescriptions = {
    bulk: 'BULK (calorie surplus, muscle building, progressive overload)',
    cut: 'CUT (calorie deficit, fat loss, muscle preservation)',
    maintain: 'MAINTAIN (maintenance calories, balanced fitness, sustainability)'
  };

  const systemPrompt = `You are Habit Coach, a direct, knowledgeable AI fitness and nutrition coach for Healthy Habits. The user's current goal is: ${goalDescriptions[currentGoal]}.

Your coaching style:
- Direct and no-nonsense, like a real personal trainer
- Give specific, actionable advice — no fluff
- When asked for meal plans: provide structured meals with macros
- When asked for workouts: provide exercises with sets and reps
- Always keep the user's goal (bulk/cut/maintain) front and center
- Be encouraging but not over-the-top

Keep responses under 200 words unless they ask for a full weekly plan.`;

  // ── ADD YOUR ANTHROPIC API KEY BELOW ──
  // Get one free at: https://console.anthropic.com
  const API_KEY = 'YOUR_ANTHROPIC_API_KEY';

  if (!API_KEY || API_KEY === 'YOUR_ANTHROPIC_API_KEY') {
    removeThinking();
    addBubble("No API key set. Open script.js and replace 'YOUR_ANTHROPIC_API_KEY' with your key from console.anthropic.com", 'coach');
    document.getElementById('sendBtn').disabled = false;
    isLoading = false;
    return;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: conversationHistory
      })
    });

    const data = await response.json();
    removeThinking();

    if (data.error) {
      addBubble(`Error: ${data.error.message}`, 'coach');
    } else {
      const reply = data.content?.[0]?.text || "Something went wrong. Try again.";
      conversationHistory.push({ role: 'assistant', content: reply });
      addBubble(reply, 'coach');
    }
  } catch (err) {
    removeThinking();
    addBubble("Connection error. Please try again.", 'coach');
    console.error('Coach API error:', err);
  }

  document.getElementById('sendBtn').disabled = false;
  isLoading = false;
}
