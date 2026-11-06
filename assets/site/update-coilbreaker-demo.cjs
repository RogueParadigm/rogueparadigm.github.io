// Médias issus du framebuffer COILBREAKER, branche feat/demo-freya-belier.
// node assets/site/update-coilbreaker-demo.cjs <atelier des captures>
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sharp=require('E:/Dev/Tools/rogue-image-masks/node_modules/sharp');
const source=path.resolve(process.argv[2]),root=path.resolve(__dirname,'../..');
const assets=path.join(root,'coilbreaker/assets'),press=path.join(root,'coilbreaker/press/assets');
const shots=['ferrailleur-00','mecano-01','belier-01','belier-04','forteresse-02'];
const manifest={date:'2026-11-06',source,files:[]};
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(async()=>{
for(const lang of ['fr','en']){
 const film=path.join(source,lang==='fr'?'film-fr':'film-en-2');
 for(let i=0;i<6;i++){
  const from=i<5?path.join(film,shots[i]+'.png'):path.join(source,'assemblage-'+lang,'frames/frame-0064.png');
  const num=String(i<5?i+1:7).padStart(2,'0'),to=path.join(assets,`screen-${num}-${lang}.webp`);
  await sharp(from).webp({quality:90}).toFile(to);
  manifest.files.push({source:from,source_sha256:hash(from),output:path.relative(root,to),sha256:hash(to)});
  if(lang==='en'){
   await sharp(from).jpeg({quality:92}).toFile(path.join(press,`coilbreaker-screenshot-${String(i+1).padStart(2,'0')}.jpg`));
   await sharp(from).resize(640).jpeg({quality:88}).toFile(path.join(press,`coilbreaker-screenshot-${String(i+1).padStart(2,'0')}-thumb.jpg`));
  }
 }
 const from=path.join(source,`COILBREAKER-demo-${lang}.mp4`),to=path.join(assets,`trailer-${lang}.mp4`);fs.copyFileSync(from,to);manifest.files.push({source:from,output:path.relative(root,to),sha256:hash(to)});
}
fs.copyFileSync(path.join(assets,'coilbreaker-logo.png'),path.join(press,'coilbreaker-logo.png'));
const logo=await sharp(path.join(assets,'coilbreaker-logo.png')).extract({left:15,top:133,width:1962,height:406}).resize(850).png().toBuffer();
await sharp(path.join(source,'film-en-2/ferrailleur-00.png')).resize(1200,675).composite([{input:logo,left:175,top:45}]).jpeg({quality:93}).toFile(path.join(press,'key-art-16x9.jpg'));
await sharp(path.join(press,'key-art-16x9.jpg')).resize(1200,630).jpeg({quality:92}).toFile(path.join(assets,'share.jpg'));
await sharp(path.join(press,'key-art-16x9.jpg')).resize(920,430).webp({quality:92}).toFile(path.join(assets,'steam-header.webp'));
fs.writeFileSync(path.join(root,'assets/site/coilbreaker-demo-2026-11-06.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('Douze captures, deux bandes-annonces et six vignettes presse mis à jour.');
})().catch(e=>{console.error(e);process.exitCode=1;});
