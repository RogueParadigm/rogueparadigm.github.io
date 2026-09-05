// Dependency-free storefront generator. Generated plugin documentation is never touched.
// Run: node assets/site/build.cjs
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const discord = 'https://discord.gg/dBrYUhx6ff';
const personalYoutube = 'https://www.youtube.com/playlist?list=PL_z_boaokQaMepqujehNt2K21F1biMJS9';
const officialYoutube = 'https://www.youtube.com/@RogueParadigm';
const products = [
  {
    id:'music', slug:'music-engine', name:'Elys Music Engine', category:'Adaptive music', status:'Available on Fab', state:'available',
    logo:'ElysMusicLogo.png', docs:'/ElysMusicEngine/', start:'/ElysMusicEngine/setup-guide',
    fab:'https://www.fab.com/listings/ab57dd0c-bf0e-442a-8b44-591c88bba0c1',
    promise:'Music that responds to exploration, combat and the moments in between.',
    benefits:['Transitions and layers','Music triggered by areas','Multiplayer synchronization'],
    intro:'Let the soundtrack follow your game. Move between musical layers, change the mood as players enter an area, and bring everyone into the same encounter.',
    cases:[['Explore a changing world','Shift the soundtrack as the player moves from a quiet village into dangerous territory.'],['Build up a battle','Add intensity when combat starts, then return to exploration when it ends.'],['Share the big moments','Synchronize music and short musical cues for a multiplayer encounter.']],
    included:['Music layers, transitions and presets','Music and stinger volumes for your levels','Dialogue ducking and multiplayer controls','Blueprint functions and integration guides'],
    compatibility:'Unreal Engine packages are distributed through Fab. Select the version matching your project in the listing.',
    versionNote:'The current guide covers UE 5.8. Check the downloadable engine versions on Fab before purchasing; availability depends on the package selected.',
    steps:['Install the matching engine package from Fab and enable the plugin.','Assign your music to a layer or place a Music Volume.','Play the level and adjust the transition to suit the scene.'],
    artTitle:'Let the soundtrack follow.', artCaption:'Exploration → Combat → Exploration',
  },
  {
    id:'listen', slug:'listen', name:'Elys Listen', category:'Offline speech recognition', status:'Coming soon to Fab', state:'soon',
    logo:'ElysListenLogo.png', docs:'/ElysListen/', start:'/ElysListen/SetupGuide', video:'jk07EjEWG3k',
    promise:'Add offline voice recognition to your Unreal game.',
    benefits:['Multilingual recognition','Push-to-talk or voice detection','Blueprint integration'],
    intro:'Turn microphone input into text on the player’s machine. Connect the result to your own gameplay, with no cloud service or runtime API key.',
    cases:[['Give players a voice','Use transcribed words as input for commands or dialogue in your own gameplay logic.'],['Show what was said','Display the result with the supplied subtitle and transcript widgets, or build your own UI.'],['Keep recognition local','Run speech recognition without an internet connection after a model has been installed.']],
    included:['Offline speech recognition and microphone controls','Push-to-talk and automatic voice detection','Optional subtitle, history and control-panel widgets','Model manager, Blueprint examples and setup guides'],
    compatibility:'Unreal Engine 5.8 · Windows 64-bit',
    versionNote:'The plugin is complete and awaiting Fab publication. Speech recognition runs offline once a model is installed. Text generation and speech synthesis are separate products.',
    steps:['After publication, install Elys Listen from Fab and enable it.','Choose a speech model in the Elys Listen Model Manager.','Start listening in Blueprint and connect the text result to your game.'],
    artTitle:'Your voice. In your game.', artCaption:'Speak → Recognize locally → Use the text',
  },
  {
    id:'licensemanager', slug:'license-manager', name:'Elys License Manager', category:'Editor workflow', status:'Available on Fab', state:'available',
    logo:'ElysLicenseManagerLogo.png', docs:'/ElysLicenseManager/', start:'/ElysLicenseManager/getting-started',
    fab:'https://www.fab.com/listings/eff36176-6fde-47f3-9ea5-57ad7c97408c',
    promise:'Know where your assets come from and what depends on them.',
    benefits:['Asset source tracking','Dependency checks','Exportable reports'],
    intro:'Keep asset sources and dependency information close to the content you work with. Review your project from a dedicated panel or the Content Browser.',
    cases:[['Organize an asset library','Associate assets and folders with the packs and publishers they came from.'],['Prepare a cleanup','Inspect references before moving or deleting content.'],['Share a project review','Export a source and coverage report for your team to review.']],
    included:['Source records and asset assignments','License coverage and dependency views','Content Browser context-menu tools','Report export and workflow documentation'],
    compatibility:'Editor-only Unreal Engine plugin. Choose the engine package offered for your project on Fab.',
    versionNote:'The current guide covers UE 5.8. Check the downloadable engine versions on Fab before purchasing; availability depends on the package selected.',
    steps:['Install the matching engine package from Fab and enable the plugin.','Create a source record for an asset pack.','Assign a folder, inspect its coverage and review its dependencies.'],
    artTitle:'Know your project’s sources.', artCaption:'Sources · Dependencies · Reports',
  },
  {
    id:'awareness', slug:'awareness', name:'Elys Awareness', category:'Targeting and interaction', status:'In development — preview', state:'preview',
    logo:'ElysAwarenessLogo.png', docs:'/ElysAwareness/', start:'/ElysAwareness/',
    promise:'Compose how players find, select and interact with the world.',
    benefits:['Target selection and lock-on','Interaction challenges','Replaceable Blueprint presentation'],
    intro:'A preview of configurable targeting and interaction tools. Assemble the selection rules, gameplay responses and UI that fit your game.',
    cases:[['Choose a target','Select nearby or aimed-at actors, then give the player focus and lock feedback.'],['Make interactions playable','Add a hold, timing or custom Blueprint challenge to an action.'],['Adapt the presentation','Replace a marker or compose another response without rewriting the target-selection logic.']],
    included:['Targeting and interaction pipelines','Reusable interaction challenge and widget bases','Blueprint demo level and composition examples','Preview documentation and API reference'],
    compatibility:'Current preview: Unreal Engine 5.8 · Windows 64-bit',
    versionNote:'Still in development. Documentation describes a preview and may evolve. No release date is announced.',
    steps:['Read the preview documentation to understand the current scope.','Explore the demo’s targeting, challenge and widget examples.','Use the composition guide to replace a response or a UI block.'],
    artTitle:'Choose. Interact. Compose.', artCaption:'Targeting · Interaction · Blueprint UI',
  },
];
const labs = [
 ['mind','Elys Mind','Local text generation','Exploring local language models for text-driven gameplay and dialogue.','ElysMind'],
 ['speak','Elys Speak','Speech synthesis','Exploring local text-to-speech and ways to connect generated speech to gameplay.','ElysSpeak'],
 ['impact','Elys Impact','Game feel','Composing camera, sound and visual responses to make gameplay events feel different.','ElysImpact'],
 ['identity','Elys Identity','Player identity','Working on persistent player identities and connections between accounts.','ElysIdentity'],
 ['chat','Elys Chat','In-game communication','Building channel-based chat, roleplay language features and conversation UI.','ElysChat'],
 ['questflow','Elys QuestFlow','Quest systems','Exploring quest definitions, event-driven progression and replaceable quest UI.','ElysQuestFlow'],
];
const link = (href, label, cls='text-link') => `<a class="${cls}" href="${esc(href)}"${href.startsWith('https:')?' target="_blank" rel="noopener noreferrer"':''}>${label}</a>`;
const badge = p => `<span class="status ${p.state}"><span aria-hidden="true"></span>${esc(p.status)}</span>`;
function actions(p) {
  const purchase = p.fab ? link(p.fab,'Buy on Fab','button primary') : p.state === 'soon' ? '<button class="button purchase-pending" type="button" disabled aria-label="Buy on Fab — coming soon" title="Coming soon to Fab">Buy on Fab</button>' : '';
  return `<div class="actions">${purchase}${link(p.docs,'Documentation','button secondary')}</div>`;
}
function art(p, isLink=true) {
  const inside = `<div class="media-grid" aria-hidden="true"></div><img src="/assets/images/${p.logo}" alt="" width="180" height="180"><div class="media-caption"><span>${esc(p.category)}</span><strong>${esc(p.artTitle)}</strong></div>`;
  return isLink ? `<a class="product-media ${p.id}" href="/${p.slug}.html" aria-label="Explore ${p.name}">${inside}</a>` : `<div class="product-media large ${p.id}" aria-hidden="true">${inside}</div>`;
}
function card(p, compact=false) {
  return `<article class="product-card${compact?' compact':''}" id="plugin-${p.id}">${compact?`<img class="compact-logo" src="/assets/images/${p.logo}" alt="" width="72" height="72" loading="lazy">`:art(p)}<div class="card-content">${badge(p)}<h3>${link('/'+p.slug+'.html',p.name,'product-name')}</h3><p class="promise">${p.promise}</p>${compact?'':`<ul class="benefits">${p.benefits.map(b=>`<li>${b}</li>`).join('')}</ul>`}${actions(p)}<div class="card-footer">${link('/'+p.slug+'.html','Explore '+p.name+' <span aria-hidden="true">↗</span>','detail-link')}${p.video ? link('https://www.youtube.com/watch?v='+p.video,'Watch demo <span aria-hidden="true">↗</span>','demo-link') : ''}</div></div></article>`;
}
function shell(title, description, content, page='') {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#101013"><title>${esc(title)} | Rogue Paradigm</title><link rel="canonical" href="https://rogueparadigm.com/${page}"><link rel="icon" href="/assets/images/favicon.png"><link rel="stylesheet" href="/assets/css/storefront.css"><script src="/assets/js/storefront.js" defer></script></head>
<body><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="container navigation"><a class="brand" href="/" aria-label="Rogue Paradigm home"><img src="/assets/images/logo_full.png" alt="Rogue Paradigm by Elys" width="210" height="64"></a><nav aria-label="Main navigation"><a href="/#plugins"${page===''?' aria-current="page"':''}>Plugins</a><a href="/documentation.html"${page==='documentation.html'?' aria-current="page"':''}>Documentation</a><a href="/support.html"${page==='support.html'?' aria-current="page"':''}>Support</a></nav></div></header>
<main id="main">${content}</main>
<footer class="site-footer"><div class="container footer-top"><div><a class="footer-brand" href="/">Rogue <span aria-hidden="true">▪</span> Paradigm</a><p>Unreal Engine plugins by Elys.</p></div><div class="footer-links"><a href="/labs.html">Labs</a>${link(officialYoutube,'YouTube · Rogue Paradigm (demos)')}${link(personalYoutube,'YouTube · Elys (personal)')}<a href="/support.html">Support</a><a href="/legal-notices.html">Legal notices</a></div></div><div class="container footer-bottom">© 2026 Rogue Paradigm by Elys</div></footer></body></html>`;
}
const write = (file,title,description,content) => fs.writeFileSync(path.join(root,file),shell(title,description,content,file==='index.html'?'':file));
write('index.html','Unreal Engine plugins','Unreal Engine plugins for adaptive music, offline voice recognition and everyday editor workflows.',`
<section class="hero container"><p class="eyebrow">Independent tools. Made by Elys.</p><h1>More for your<br><span>Unreal project.</span></h1><p class="hero-copy">Plugins to add features to your game<br class="desktop-break"> and simplify your work in the editor.</p>${link('#plugins','Explore the plugins <span aria-hidden="true">↓</span>','button primary')}</section>
<section class="container products-section" id="plugins" aria-labelledby="plugins-title"><div class="section-heading"><div><p class="eyebrow">The plugins</p><h2 id="plugins-title">Start with what your game needs.</h2></div><p>Explore the tools.<br>See what each one can do.</p></div><div class="featured-grid">${products.slice(0,2).map(p=>card(p)).join('')}</div><div class="secondary-grid">${products.slice(2).map(p=>card(p,true)).join('')}</div></section>
<section class="container help-band"><div><p class="eyebrow">From idea to implementation</p><h2>Find your first step.</h2><p>Setup guides, examples and API references for each plugin.</p></div>${link('/documentation.html','Browse documentation <span aria-hidden="true">↗</span>','button secondary')}</section>`);
for (const p of products) {
  const visual = p.video ? `<div class="demo-player" data-video="${p.video}"><button class="demo-start" type="button" aria-label="Play ${p.name} demo">${art(p,false)}<span class="demo-play-label">▷ Play the demo</span></button></div><p class="caption">Actual gameplay demo · ${link('https://www.youtube.com/watch?v='+p.video,'Watch on YouTube')}</p>` : `${art(p,false)}<p class="caption">${p.artCaption}</p>`;
  write(p.slug+'.html',p.name,p.promise,`<div class="container product-page"><a class="back-link" href="/#plugins">← All plugins</a><section class="product-hero"><div>${badge(p)}<p class="eyebrow">${p.category}</p><h1>${p.name}</h1><p class="product-lead">${p.promise}</p><p>${p.intro}</p>${actions(p)}</div><div>${visual}</div></section><section class="page-section"><p class="eyebrow">In your project</p><h2>Three ways to use it.</h2><div class="use-cases">${p.cases.map(([title,body],i)=>`<article><span class="case-number">0${i+1}</span><h3>${title}</h3><p>${body}</p></article>`).join('')}</div></section><section class="page-section included-section"><div><p class="eyebrow">What you get</p><h2>${p.state==='preview'?'Inside the preview.':'Included with the plugin.'}</h2><ul class="included-list">${p.included.map(s=>`<li>${s}</li>`).join('')}</ul></div><aside class="compatibility"><h3>Unreal Engine &amp; availability</h3><p class="compatibility-title">${p.compatibility}</p><p>${p.versionNote}</p>${p.fab?link(p.fab,'Check versions on Fab ↗'):badge(p)}</aside></section><section class="page-section"><p class="eyebrow">Getting started</p><h2>${p.state==='preview'?'Explore the design.':'Make it work in your project.'}</h2><ol class="steps">${p.steps.map(s=>`<li>${s}</li>`).join('')}</ol>${link(p.start,p.state==='preview'?'Read preview documentation ↗':'Open the setup guide ↗','button secondary')}</section><section class="help-band product-help"><div><h2>${p.fab?'Ready to add it to your project?':'Follow the next step.'}</h2><p>${p.fab?'Get the plugin on Fab. For setup questions or a collaboration, get in touch.':p.state==='soon'?'Fab publication is pending. Watch the demo, explore the docs or get in touch.':'Explore the preview documentation or share your use case. No release date is announced.'}</p></div><div class="actions">${p.fab?link(p.fab,'Buy on Fab','button primary'):''}${link('/support.html','Get support','button secondary')}</div></section></div>`);
}
write('labs.html','Labs','Experiments and work in progress from Rogue Paradigm.',`<section class="container inner-hero"><p class="eyebrow">Rogue Paradigm / Labs</p><h1>Ideas taking shape.</h1><p class="hero-copy">Experiments, prototypes and tools in development.<br>Explore the work without mistaking it for a released product.</p>${link('/#plugins','← Back to the plugins')}</section><section class="container labs-grid" aria-label="Experimental projects">${labs.map(([id,name,category,description,docs])=>`<article class="lab-card" id="plugin-${id}"><span class="status preview"><span aria-hidden="true"></span>In development</span><p class="eyebrow">${category}</p><h2>${name}</h2><p>${description}</p>${link('/'+docs+'/','Explore development docs ↗')}</article>`).join('')}</section><div class="container labs-note"><p>Scope and implementation may change as these projects evolve. Release dates are not announced here.</p></div>`);
write('documentation.html','Documentation','Setup guides and documentation for Rogue Paradigm Unreal Engine plugins.',`<section class="container inner-hero"><p class="eyebrow">Documentation</p><h1>From the first step<br>to the details.</h1><p class="hero-copy">Choose a plugin for setup instructions, examples and API references.</p></section><section class="container documentation-grid" aria-label="Plugin documentation">${products.map(p=>`<article class="doc-card">${badge(p)}<h2>${p.name}</h2><p>${p.promise}</p><div class="actions">${link(p.docs,p.state==='preview'?'Preview documentation ↗':'Documentation ↗','button primary')}${link('/'+p.slug+'.html','Product overview')}</div></article>`).join('')}</section><div class="container labs-note"><p>Looking for an experimental project? ${link('/labs.html','Find development documentation in Labs ↗')}</p></div>`);
write('support.html','Support & collaboration','Get help with Rogue Paradigm plugins or discuss a collaboration with Elys.',`<section class="container inner-hero"><p class="eyebrow">Support &amp; collaboration</p><h1>Let’s talk about<br>your project.</h1><p class="hero-copy">A setup question, a bug to report, or an idea for working together.</p>${link(discord,'Join the Discord <span aria-hidden="true">↗</span>','button primary')}</section><section class="container support-grid"><article><h2>Need a hand?</h2><p>Share the plugin name, your Unreal Engine version and what you are trying to do. For a bug, include the steps to reproduce it and the relevant error message.</p>${link('/documentation.html','Check the documentation ↗')}</article><article><h2>Have a collaboration in mind?</h2><p>Tell Elys about your project, the plugin you are interested in and what you would like to create together.</p>${link(discord,'Start the conversation on Discord ↗')}</article><article><h2>Purchases and downloads</h2><p>Published plugins are distributed through Fab. Use the product’s listing and your Fab Library for purchases, supported engine packages and updates.</p>${link('/#plugins','Find a product ↗')}</article></section>`);
console.log('Generated 8 storefront pages. Plugin documentation directories unchanged.');
