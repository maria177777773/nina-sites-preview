(() => {
  // Dynamic dialogs and menus share the approved styling without restyling page content.
  const decorate = () => {
    document.querySelectorAll('body > .menu-shade,body > .mobile-dim,body > dialog,body > #catalyst-chat,body > #chat-launcher,body > #scroll-offer,body > .popup-close-floater').forEach(el => {
      if (!el.classList.contains('catalyst-chrome')) el.classList.add('catalyst-chrome');
    });
  };
  decorate();
  new MutationObserver(decorate).observe(document.body,{childList:true});
  // Existing program CTAs use the same updated form as the new header.
  window.ccOpen = () => {
    const trigger=document.querySelector('#header [data-form="callback"]');
    trigger?.click();
  };
  document.addEventListener('click', e => {
    const a=e.target.closest('a[href="#contacts"],a[href="#catalyst-chatbot"],a[href="#kviz"]');
    if(!a)return;
    e.preventDefault();
    if(a.getAttribute('href')==='#contacts')document.querySelector('#s10')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
    else {e.stopImmediatePropagation();window.ccOpen();}
  },true);
})();
