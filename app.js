const ideaInput = document.getElementById('ideaInput');
const forgeBtn = document.getElementById('forgeBtn');
const exampleBtn = document.getElementById('exampleBtn');
const steps = [...document.querySelectorAll('#steps li')];
const statusLabel = document.getElementById('statusLabel');
const continueBtn = document.getElementById('continueBtn');
const previewText = document.getElementById('previewText');
const meterFill = document.getElementById('meterFill');
const scoreText = document.getElementById('scoreText');
const projectGrid = document.getElementById('projectGrid');
const clearProjects = document.getElementById('clearProjects');
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.querySelector('.sidebar');

const seedProjects = [
  { name:'Milwaukee Battery Holder', idea:'Wall mounted tool battery rack', status:'Ready to continue', score:92, icon:'🔋' },
  { name:'Fishing Rod Holder', idea:'Garage wall organiser for rods', status:'Print quote ready', score:89, icon:'🎣' },
  { name:'GWM Jolion Clip', idea:'Custom dashboard phone clip', status:'Needs scan photos', score:76, icon:'🚗' }
];

function getProjects(){
  const saved = localStorage.getItem('sf_projects');
  if(saved) return JSON.parse(saved);
  localStorage.setItem('sf_projects', JSON.stringify(seedProjects));
  return seedProjects;
}
function saveProjects(items){ localStorage.setItem('sf_projects', JSON.stringify(items)); }
function renderProjects(){
  const items = getProjects();
  projectGrid.innerHTML = items.map(p => `
    <article class="project">
      <div class="icon">${p.icon || '✨'}</div>
      <h3>${p.name}</h3>
      <p>${p.idea}</p>
      <span class="status">${p.status} • ${p.score}% printable</span>
    </article>`).join('');
}
function projectNameFromIdea(idea){
  const cleaned = idea.replace(/make me|create|design|a |an |the /gi,'').trim();
  return cleaned.split(' ').slice(0,4).map(w=>w[0]?.toUpperCase()+w.slice(1)).join(' ') || 'New ShapeForge Project';
}
async function forge(){
  const idea = ideaInput.value.trim();
  if(!idea){ ideaInput.focus(); return; }
  forgeBtn.disabled = true;
  continueBtn.classList.add('hidden');
  steps.forEach(s=>s.classList.remove('done'));
  statusLabel.textContent = 'Forging';
  previewText.textContent = 'Creating your project...';
  meterFill.style.width = '8%';
  scoreText.textContent = 'Printability check starting...';
  const progress = [24, 48, 74, 94];
  for(let i=0;i<steps.length;i++){
    await new Promise(r=>setTimeout(r, 760));
    steps[i].classList.add('done');
    meterFill.style.width = progress[i] + '%';
    scoreText.textContent = i < 2 ? 'Analysing geometry...' : `Printability ${progress[i]}%`;
  }
  const newProject = { name: projectNameFromIdea(idea), idea, status:'First preview ready', score:94, icon:'✨' };
  const projects = [newProject, ...getProjects()].slice(0,9);
  saveProjects(projects);
  renderProjects();
  previewText.textContent = newProject.name + ' is ready for the next step.';
  statusLabel.textContent = 'Ready';
  continueBtn.classList.remove('hidden');
  forgeBtn.disabled = false;
  location.hash = 'projects';
}

forgeBtn.addEventListener('click', forge);
exampleBtn.addEventListener('click', ()=>{ ideaInput.value = 'Make me a wall-mounted Milwaukee battery holder'; ideaInput.focus(); });
document.querySelectorAll('[data-preset]').forEach(btn=>btn.addEventListener('click',()=>{ideaInput.value=btn.dataset.preset; forge();}));
continueBtn.addEventListener('click',()=>alert('Next sprint: this opens the full Project Workspace with versions, files, print settings and AI assistant.'));
clearProjects.addEventListener('click',()=>{ localStorage.removeItem('sf_projects'); renderProjects(); });
menuBtn.addEventListener('click',()=>sidebar.classList.toggle('open'));
renderProjects();
