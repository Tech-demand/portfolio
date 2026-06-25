/* ===== RAHUL SHARMA PORTFOLIO - SCRIPT.JS ===== */

// ---- CUSTOM CURSOR ----
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, fX = 0, fY = 0;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px';
});
function animFollower() {
  fX += (mouseX - fX) * 0.12; fY += (mouseY - fY) * 0.12;
  follower.style.left = fX + 'px'; follower.style.top = fY + 'px';
  requestAnimationFrame(animFollower);
}
animFollower();

// ---- PARTICLE CANVAS ----
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [], mouse = { x: -1000, y: -1000 };
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random()*W; this.y = Math.random()*H;
    this.vx = (Math.random()-0.5)*0.4; this.vy = (Math.random()-0.5)*0.4;
    this.r = Math.random()*1.6+0.4; this.alpha = Math.random()*0.6+0.1;
    this.color = Math.random()>0.5 ? `rgba(0,229,255,${this.alpha})` : `rgba(168,85,247,${this.alpha})`;
  }
  update() {
    const dx=mouse.x-this.x, dy=mouse.y-this.y, dist=Math.sqrt(dx*dx+dy*dy);
    if(dist<120){const f=(120-dist)/120*0.8; this.vx-=(dx/dist)*f; this.vy-=(dy/dist)*f;}
    this.vx*=0.98; this.vy*=0.98; this.x+=this.vx; this.y+=this.vy;
    if(this.x<-10)this.x=W+10; if(this.x>W+10)this.x=-10;
    if(this.y<-10)this.y=H+10; if(this.y>H+10)this.y=-10;
  }
  draw() { ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fillStyle=this.color; ctx.fill(); }
}
for(let i=0;i<120;i++) particles.push(new Particle());
function drawConnections() {
  for(let i=0;i<particles.length;i++) for(let j=i+1;j<particles.length;j++){
    const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y, d=Math.sqrt(dx*dx+dy*dy);
    if(d<100){ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.strokeStyle=`rgba(0,229,255,${(1-d/100)*0.12})`;ctx.lineWidth=0.5;ctx.stroke();}
  }
}
function animParticles(){ctx.clearRect(0,0,W,H);drawConnections();particles.forEach(p=>{p.update();p.draw();});requestAnimationFrame(animParticles);}
animParticles();

// ---- TYPEWRITER ----
const roles=['Azure Data Engineer','AI Explorer','Frontend Developer','Software Developer','Cloud Enthusiast','IoT & Embedded Dev'];
let rIdx=0,cIdx=0,deleting=false;
const tw=document.getElementById('typewriter-text');
function typewriter(){
  const cur=roles[rIdx];
  if(!deleting){tw.textContent=cur.slice(0,++cIdx);if(cIdx===cur.length){deleting=true;setTimeout(typewriter,1800);return;}}
  else{tw.textContent=cur.slice(0,--cIdx);if(cIdx===0){deleting=false;rIdx=(rIdx+1)%roles.length;}}
  setTimeout(typewriter,deleting?55:90);
}
setTimeout(typewriter,1200);

// ---- NAVBAR ----
const nav=document.querySelector('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>40));

// ---- SCROLL REVEAL ----
const revealObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});
},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el));

// ---- ACTIVE NAV ----
const sections=document.querySelectorAll('section[id]');
const navLinks=document.querySelectorAll('.nav-links a');
window.addEventListener('scroll',()=>{
  let cur='';
  sections.forEach(s=>{if(window.scrollY>=s.offsetTop-100)cur=s.id;});
  navLinks.forEach(a=>{a.style.color=a.getAttribute('href')==='#'+cur?'var(--cyan)':'';});
});

// ---- MOBILE MENU ----
const menuBtn=document.getElementById('menuBtn');
const menuClose=document.getElementById('menuClose');
const mobileMenu=document.getElementById('mobileMenu');
if(menuBtn)    menuBtn.addEventListener('click',()=>mobileMenu.classList.add('open'));
if(menuClose)  menuClose.addEventListener('click',()=>mobileMenu.classList.remove('open'));
document.querySelectorAll('.mob-link').forEach(a=>a.addEventListener('click',()=>mobileMenu.classList.remove('open')));

// ---- 3D TILT ----
document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-0.5, y=(e.clientY-r.top)/r.height-0.5;
    card.style.transform=`translateY(-6px) rotateY(${x*8}deg) rotateX(${-y*8}deg)`;
  });
  card.addEventListener('mouseleave',()=>card.style.transform='');
});

// ---- ORBIT DOTS ----
document.querySelectorAll('.orbit-dot').forEach((dot,i,arr)=>{
  const radius=145; let angle=(i/arr.length)*360;
  function anim(){angle+=0.4;const rad=angle*Math.PI/180;dot.style.transform=`translate(${Math.cos(rad)*radius-18}px,${Math.sin(rad)*radius-18}px)`;requestAnimationFrame(anim);}
  anim();
});

// ---- CONTACT FORM ----
const form=document.getElementById('contact-form');
if(form) form.addEventListener('submit',e=>{
  e.preventDefault();
  const btn=form.querySelector('button[type="submit"]');
  btn.textContent='✓ Message Sent!';
  btn.style.background='linear-gradient(135deg,#00e5ff,#7c3aed)';
  setTimeout(()=>{btn.textContent='Send Message 🚀';btn.style.background='';},3000);
});

// ---- COUNT ANIMATION ----
function animateCount(el, target, duration=1400){
  let start=null;
  function step(ts){
    if(!start)start=ts;
    const p=Math.min((ts-start)/duration,1);
    const ease=1-Math.pow(1-p,3);
    el.textContent=Math.floor(ease*target);
    if(p<1)requestAnimationFrame(step); else el.textContent=target;
  }
  requestAnimationFrame(step);
}

// ===================================================
// ====== LEETCODE — LeetCode Official GraphQL =======
// ===================================================
const LC_USER = 'rahulsharma274702';

// LeetCode ka official GraphQL endpoint use kar rahe hain
// CORS proxy ke through — ye reliably kaam karta hai
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
];

const LC_GRAPHQL = 'https://leetcode.com/graphql';

// Query 1: Solved stats
const QUERY_STATS = `
  query getUserStats($username: String!) {
    matchedUser(username: $username) {
      submitStats {
        acSubmissionNum {
          difficulty
          count
        }
      }
      profile {
        ranking
      }
    }
    allQuestionsCount {
      difficulty
      count
    }
  }
`;

// Query 2: Submission calendar (heatmap)
const QUERY_CALENDAR = `
  query getUserCalendar($username: String!) {
    matchedUser(username: $username) {
      userCalendar {
        submissionCalendar
      }
    }
  }
`;

async function fetchWithProxy(proxyUrl, body) {
  const targetUrl = LC_GRAPHQL;
  const fullUrl   = proxyUrl + encodeURIComponent(targetUrl);

  const res = await fetch(fullUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(12000)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error('GraphQL error');
  return json;
}

async function tryAllProxies(body) {
  for (const proxy of CORS_PROXIES) {
    try {
      console.log(`[LC] Trying proxy: ${proxy}`);
      const data = await fetchWithProxy(proxy, body);
      console.log(`[LC] ✅ Success with proxy: ${proxy}`);
      return data;
    } catch(e) {
      console.warn(`[LC] ❌ Proxy failed: ${proxy}`, e.message);
    }
  }
  throw new Error('All proxies failed');
}

async function fetchLCStats() {
  try {
    // Fetch stats + calendar in parallel, both through proxies
    const [statsData, calData] = await Promise.all([
      tryAllProxies({
        query: QUERY_STATS,
        variables: { username: LC_USER }
      }),
      tryAllProxies({
        query: QUERY_CALENDAR,
        variables: { username: LC_USER }
      })
    ]);

    const user    = statsData.data.matchedUser;
    const allQ    = statsData.data.allQuestionsCount;
    const acSubs  = user.submitStats.acSubmissionNum;

    // Parse solved counts
    const getCount = (diff) => (acSubs.find(s=>s.difficulty===diff)||{count:0}).count;
    const getTotal = (diff) => (allQ.find(q=>q.difficulty===diff)||{count:0}).count;

    const totalSolved  = getCount('All');
    const easySolved   = getCount('Easy');
    const mediumSolved = getCount('Medium');
    const hardSolved   = getCount('Hard');
    const totalEasy    = getTotal('Easy');
    const totalMedium  = getTotal('Medium');
    const totalHard    = getTotal('Hard');
    const totalQ       = getTotal('All');

    // Parse calendar
    let submissionCalendar = {};
    try {
      const calStr = calData.data.matchedUser.userCalendar.submissionCalendar;
      submissionCalendar = JSON.parse(calStr);
    } catch(e) { submissionCalendar = {}; }

    return {
      totalSolved, easySolved, mediumSolved, hardSolved,
      totalEasy, totalMedium, totalHard, totalQ,
      ranking: user.profile.ranking || null,
      acceptanceRate: totalQ > 0 ? ((totalSolved / totalQ) * 100).toFixed(1) : null,
      submissionCalendar
    };
  } catch(e) {
    console.error('[LC] GraphQL fetch failed:', e.message);
    return null;
  }
}

function buildHeatmap(calendar) {
  const heatmap = document.getElementById('lc-heatmap');
  if (!heatmap) return;
  heatmap.innerHTML = '';
  const now   = Math.floor(Date.now()/1000);
  const start = now - 26*7*24*3600;
  const values = Object.values(calendar).map(Number).filter(v=>v>0);
  const maxVal = values.length ? Math.max(...values) : 1;

  for(let w=0;w<26;w++){
    const weekDiv=document.createElement('div');
    weekDiv.className='heat-week';
    for(let d=0;d<7;d++){
      const ts=start+(w*7+d)*24*3600;
      if(ts>now) break;
      const count=calendar[String(ts)]||0;
      const level=count===0?0:Math.min(5,Math.ceil((count/maxVal)*5));
      const cell=document.createElement('div');
      cell.className='heat-day'; cell.dataset.count=level;
      cell.title=`${new Date(ts*1000).toDateString()}: ${count} submission${count!==1?'s':''}`;
      weekDiv.appendChild(cell);
    }
    heatmap.appendChild(weekDiv);
  }
}

function renderLCStats(data) {
  document.getElementById('lc-loading').style.display='none';
  document.getElementById('lc-error').style.display='none';
  document.getElementById('lc-content').style.display='block';

  // SVG gradient
  const svg=document.querySelector('.lc-donut');
  if(svg && !svg.querySelector('defs')){
    const defs=document.createElementNS('http://www.w3.org/2000/svg','defs');
    defs.innerHTML=`<linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#00e5ff"/>
      <stop offset="100%" style="stop-color:#a855f7"/>
    </linearGradient>`;
    svg.insertBefore(defs,svg.firstChild);
  }

  // Donut ring
  const circumference = 2*Math.PI*80;
  const pct = Math.min(data.totalSolved / (data.totalQ||3516), 1);
  const track = document.getElementById('donut-track');
  setTimeout(()=>{
    if(track) track.style.strokeDasharray=`${pct*circumference} ${circumference}`;
    const el=document.getElementById('lc-total');
    if(el) animateCount(el, data.totalSolved);
  }, 400);

  // Ranking & acceptance
  const rankEl=document.getElementById('lc-ranking');
  const accEl =document.getElementById('lc-acceptance');
  if(rankEl) rankEl.textContent = data.ranking ? '#'+Number(data.ranking).toLocaleString() : 'N/A';
  if(accEl)  accEl.textContent  = data.acceptanceRate ? data.acceptanceRate+'%' : 'N/A';

  // Difficulty bars
  setTimeout(()=>{
    [
      {id:'easy',   solved:data.easySolved,   total:data.totalEasy},
      {id:'medium', solved:data.mediumSolved, total:data.totalMedium},
      {id:'hard',   solved:data.hardSolved,   total:data.totalHard},
    ].forEach(({id,solved,total})=>{
      const s=document.getElementById(`lc-${id}`);
      const t=document.getElementById(`lc-${id}-total`);
      const b=document.getElementById(`lc-${id}-bar`);
      if(s) animateCount(s, solved);
      if(t) t.textContent='/ '+total;
      if(b) b.style.width=(total>0?(solved/total*100).toFixed(1):0)+'%';
    });
  }, 500);

  // Heatmap
  buildHeatmap(data.submissionCalendar||{});

  // Trigger reveals inside lc-content
  document.querySelectorAll('#lc-content .reveal').forEach(el=>revealObs.observe(el));
}

function showLCError() {
  document.getElementById('lc-loading').style.display='none';
  document.getElementById('lc-error').style.display='block';
  document.getElementById('lc-content').style.display='none';
}

function resetLCUI() {
  document.getElementById('lc-loading').style.display='flex';
  document.getElementById('lc-error').style.display='none';
  document.getElementById('lc-content').style.display='none';
}

const retryBtn=document.getElementById('lc-retry-btn');
if(retryBtn) retryBtn.addEventListener('click', initLC);

async function initLC() {
  resetLCUI();
  const data = await fetchLCStats();
  if(data) renderLCStats(data);
  else     showLCError();
}

initLC();

console.log('%c🚀 Rahul Sharma Portfolio','color:#00e5ff;font-size:20px;font-weight:bold;');
console.log('%cGitHub: Tech-demand | LeetCode: rahulsharma274702','color:#a855f7;font-size:12px;');
