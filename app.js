document.querySelectorAll('[data-open]').forEach(el=>el.addEventListener('click',()=>{const t=el.dataset.open;alert(t+' opened. Backend connection comes next.');}));
