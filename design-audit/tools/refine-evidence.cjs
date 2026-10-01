const fs=require('fs');
const p='design-audit/tools/write-reports.cjs';let s=fs.readFileSync(p,'utf8');
const begin=s.indexOf('for(const {r,f}of comps){');const end=s.indexOf("inventory.push('## Parallel",begin);let block=s.slice(begin,end);
block=block.replace('for(const {r,f}of comps){','for(const {r,f}of comps){\nconst within=x=>x.line>=f.line&&x.line<f.line+f.text.split(/\\r?\\n/).length;');
block=block.replaceAll('r.lines.filter(l=>','r.lines.filter(within).filter(l=>').replaceAll('r.classes.flatMap','r.classes.filter(within).flatMap').replaceAll('r.styles.filter(x=>','r.styles.filter(within).filter(x=>');
s=s.slice(0,begin)+block+s.slice(end);fs.writeFileSync(p,s);
for(const file of ['design-audit/tools/collect-source.cjs',p]){let t=fs.readFileSync(file,'utf8');t=t.replace("String(s).replaceAll('|'","String(s).replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('|'");fs.writeFileSync(file,t);}

