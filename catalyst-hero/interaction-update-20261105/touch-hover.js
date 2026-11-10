/* Touch devices must not retain mouse hover styles after tapping. */
(()=>{
 const mouse=matchMedia('(min-width:701px) and (hover:hover) and (pointer:fine)'),originals=new WeakMap(),roots=new Set();
 function rules(list){for(const rule of list){if(rule.cssRules)rules(rule.cssRules);if(!rule.selectorText)continue;let source=originals.get(rule);if(!source&&rule.selectorText.includes(':hover')){source=rule.selectorText;originals.set(rule,source);}if(source)rule.selectorText=mouse.matches?source:source.replace(/:hover\b/g,':hover:where(:not(*))');}}
 function sheet(s){if(s?.ownerNode?.hasAttribute('data-hover-ready'))return;try{rules(s.cssRules)}catch{}}
 function scan(root){if(!roots.has(root)){roots.add(root);new MutationObserver(records=>{for(const r of records)for(const el of r.addedNodes)if(el.nodeType===1){if(el.matches('style,link[rel="stylesheet"]')){if(el.sheet)sheet(el.sheet);el.addEventListener('load',()=>sheet(el.sheet),{once:true});}discover(el);}}).observe(root,{childList:true,subtree:true});}for(const s of root.styleSheets||[])sheet(s);for(const link of root.querySelectorAll('link[rel="stylesheet"]'))link.addEventListener('load',()=>sheet(link.sheet),{once:true});discover(root);}
 function discover(root){if(root.shadowRoot)scan(root.shadowRoot);for(const el of root.querySelectorAll('*'))if(el.shadowRoot)scan(el.shadowRoot);}
 mouse.addEventListener('change',()=>{for(const root of roots)for(const s of root.styleSheets||[])sheet(s);});scan(document);
})();
