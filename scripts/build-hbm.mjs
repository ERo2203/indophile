// Usage: node scripts/build-hbm.mjs <dir with historical-basemaps world_*.geojson> public/geo/hbm.json
// historical-basemaps (A. Ourednik et al.), GPL-3.0 — https://github.com/aourednik/historical-basemaps
// Each time slice is valid from its year until the next slice. Clipped to South Asia and simplified.
import fs from "node:fs";
const [dir, outFile] = process.argv.slice(2);
const [W, S, E, N] = [55, -2, 105, 45];
const TOL = 0.015;
const r2 = (v) => Math.round(v * 100) / 100;
function bbox(g){let a=[1e9,1e9,-1e9,-1e9];const walk=c=>{if(typeof c[0]==="number"){a[0]=Math.min(a[0],c[0]);a[1]=Math.min(a[1],c[1]);a[2]=Math.max(a[2],c[0]);a[3]=Math.max(a[3],c[1]);}else c.forEach(walk)};walk(g.coordinates);return a;}
function clipRing(ring){const inside=[p=>p[0]>=W,p=>p[0]<=E,p=>p[1]>=S,p=>p[1]<=N];const cut=[(a,b)=>[W,a[1]+(W-a[0])*(b[1]-a[1])/(b[0]-a[0])],(a,b)=>[E,a[1]+(E-a[0])*(b[1]-a[1])/(b[0]-a[0])],(a,b)=>[a[0]+(S-a[1])*(b[0]-a[0])/(b[1]-a[1]),S],(a,b)=>[a[0]+(N-a[1])*(b[0]-a[0])/(b[1]-a[1]),N]];let out=ring;for(let k=0;k<4;k++){const inp=out;out=[];if(!inp.length)break;for(let i=0;i<inp.length;i++){const cur=inp[i],prev=inp[(i+inp.length-1)%inp.length];const ci=inside[k](cur),pi=inside[k](prev);if(ci){if(!pi)out.push(cut[k](prev,cur));out.push(cur);}else if(pi)out.push(cut[k](prev,cur));}}return out;}
function dp(pts,tol){if(pts.length<=3)return pts;const keep=new Uint8Array(pts.length);keep[0]=keep[pts.length-1]=1;const st=[[0,pts.length-1]];while(st.length){const [a,b]=st.pop();let md=0,mi=-1;const [x1,y1]=pts[a],[x2,y2]=pts[b];const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1e-12;for(let i=a+1;i<b;i++){const d=Math.abs(dy*pts[i][0]-dx*pts[i][1]+x2*y1-y2*x1)/L;if(d>md){md=d;mi=i;}}if(md>tol){keep[mi]=1;st.push([a,mi],[mi,b]);}}return pts.filter((_,i)=>keep[i]);}
function dpRing(r){const m=Math.floor(r.length/2);return [...dp(r.slice(0,m+1),TOL).slice(0,-1),...dp(r.slice(m),TOL)];}
function ringOut(ring){let r=clipRing(ring);if(r.length<4)return null;r=dpRing(r).map(p=>[r2(p[0]),r2(p[1])]);const d=[];for(const p of r){const l=d[d.length-1];if(!l||l[0]!==p[0]||l[1]!==p[1])d.push(p);}return d.length>=4?d:null;}
const year = (n) => (n.startsWith("bc") ? -Number(n.slice(2)) : Number(n));
const slices = fs.readdirSync(dir).filter((f) => /^world_(bc)?\d+\.geojson$/.test(f)).map((f) => ({ f, y: year(f.slice(6, -8)) })).sort((a, b) => a.y - b.y);
// Language families and ethnic labels drawn as territories (precision 1 in the source).
// They map speakers, not polities, and some are unsupported for their dates (e.g. the
// whole subcontinent as "Austro-Asiatic rice cultures" c. 2000 BCE), so they are left out.
const EXCLUDE = new Set(["Austro-Asiatic rice cultures", "Tibeto-Burmanese", "Dravidians", "Vedic Aryans", "Iranian pastoralists", "Tibetans", "Burmese", "Thai", "Proto-Tibetan cultures",
  // Generic fillers that put a religious label on unnamed polities.
  "Hindu kingdoms", "Hindu kingdoms and republics"]);
const out = [];
slices.forEach((s, i) => {
  const to = i + 1 < slices.length ? slices[i + 1].y - 1 : 1946;
  const fc = JSON.parse(fs.readFileSync(`${dir}/${s.f}`, "utf8"));
  for (const f of fc.features) {
    const p = f.properties ?? {};
    if (!f.geometry || !p.NAME || EXCLUDE.has(p.NAME)) continue;
    const b = bbox(f.geometry); const cx = (b[0]+b[2])/2, cy = (b[1]+b[3])/2;
    if (!(cx > 58 && cx < 99 && cy > 3 && cy < 40)) continue;
    const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
    const mp = [];
    for (const poly of polys) { const o = ringOut(poly[0]); if (o) mp.push([o, ...poly.slice(1).map(ringOut).filter(Boolean)]); }
    if (!mp.length) continue;
    out.push({ type: "Feature", properties: { n: p.NAME, f: s.y, t: to, p: p.BORDERPRECISION ?? 1, of: p.SUBJECTO && p.SUBJECTO !== p.NAME ? p.SUBJECTO : null }, geometry: { type: "MultiPolygon", coordinates: mp } });
  }
});
fs.writeFileSync(outFile, JSON.stringify({ type: "FeatureCollection", source: "historical-basemaps (aourednik), GPL-3.0 — clipped to South Asia and simplified by Indophile", features: out }));
console.log("features", out.length, "bytes", fs.statSync(outFile).size);
