const CONCISE=[
["LMU Munich","Check relevant Informatics option","Yes"],
["Tübingen","Yes, German required","Yes"],
["TUM","Yes","Physics alternative"],
["Bayreuth","Yes",""],["Saarland","Yes",""],["Siegen","Yes",""],
["Bonn","","Yes"],["Potsdam","","Yes"],
["Heidelberg","","Physics with astrophysics options"]];
const KEY="msc-tracker-v1";
let state={};
try{state=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const cell=v=>!v?'<span class="dash">—</span>':v==="Yes"?'<span class="yes">Yes</span>':esc(v);

function updateCount(){$("#count").textContent=Object.values(state).filter(Boolean).length}

function renderConcise(){
  $("#concise-body").innerHTML=CONCISE.map(([u,c,a])=>{
    const id="c:"+u;
    return `<tr class="${state[id]?"done":""}"><td class="chk"><input type="checkbox" data-id="${id}" ${state[id]?"checked":""}></td><td>${esc(u)}</td><td>${cell(c)}</td><td>${cell(a)}</td></tr>`}).join("");
}

let filter="all";
function renderDetail(){
  const q=$("#search").value.toLowerCase();
  $("#cards").innerHTML=DETAILS.filter(d=>(filter==="all"||d.track===filter)&&(d.uni+d.prog).toLowerCase().includes(q)).map(d=>{
    const id="d:"+d.uni;
    return `<article class="card ${state[id]?"done":""}">
<div class="top"><input type="checkbox" data-id="${id}" ${state[id]?"checked":""} title="Mark as done">
<div><h3>${esc(d.uni)}</h3><p>${esc(d.prog)}</p></div>
<div class="tags"><span class="tag">${esc(d.track)}</span><span class="tag">${esc(d.fit)}</span></div></div>
<dl>
<dt>Language</dt><dd>${esc(d.lang)}</dd>
<dt>Intake</dt><dd>${esc(d.intake)}</dd>
<dt>Deadline 2027/28</dt><dd class="dl">${esc(d.deadline)}</dd>
<dt>Provisional / final certificate</dt><dd>${esc(d.prov)}</dd>
<dt>Eligibility notes</dt><dd>${esc(d.elig)}</dd>
<dt>Links</dt><dd class="links"><a href="${esc(d.web)}" target="_blank" rel="noopener">Programme page</a><a href="${esc(d.adm)}" target="_blank" rel="noopener">Admissions / deadlines</a></dd>
</dl></article>`}).join("")||"<p>No matches.</p>";
}

document.addEventListener("change",e=>{
  const id=e.target.dataset?.id;if(!id)return;
  state[id]=e.target.checked;save();updateCount();
  e.target.closest("tr,.card").classList.toggle("done",e.target.checked);
});
$$(".tab").forEach(b=>b.onclick=()=>{
  $$(".tab").forEach(x=>x.classList.toggle("active",x===b));
  $$(".panel").forEach(p=>p.classList.toggle("active",p.id===b.dataset.tab));
});
$$(".f").forEach(b=>b.onclick=()=>{filter=b.dataset.f;$$(".f").forEach(x=>x.classList.toggle("active",x===b));renderDetail()});
$("#search").oninput=renderDetail;
$("#reset").onclick=()=>{if(confirm("Clear all ticks?")){state={};save();renderConcise();renderDetail();updateCount()}};
renderConcise();renderDetail();updateCount();
