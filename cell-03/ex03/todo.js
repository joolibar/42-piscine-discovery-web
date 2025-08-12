(function(){
    const list = document.getElementById('ft_list');
    const newBtn = document.getElementById('newBtn');
    const emptyMsg = document.getElementById('emptyMessage');
  
    function saveTodos(){
      const todos = Array.from(list.children).map(div => div.textContent);
      document.cookie = "todos=" + encodeURIComponent(JSON.stringify(todos)) + ";path=/;max-age=31536000";
    }
  
    function loadTodos(){
      const match = document.cookie.match(/(?:^|;)\\s*todos=([^;]+)/);
      if(match){
        try {
          const todos = JSON.parse(decodeURIComponent(match[1]));
          todos.forEach(text => createTodo(text, false));
        } catch(e) {
          console.error("Error loading todos:", e);
        }
      }
      updateEmptyMessage();
    }
  
    function updateEmptyMessage(){
      emptyMsg.style.display = list.children.length === 0 ? 'block' : 'none';
    }
  
    function createTodo(text, save = true){
      if(!text) return;
      const div = document.createElement('div');
      div.className = 'todo';
  
      const textSpan = document.createElement('span');
      textSpan.textContent = text;
  
      const delIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      delIcon.setAttribute('viewBox', '0 0 24 24');
      delIcon.setAttribute('width', '20');
      delIcon.setAttribute('height', '20');
      delIcon.classList.add('delete-icon');
      delIcon.setAttribute('aria-label', 'Eliminar tarea');
      delIcon.setAttribute('role', 'button');
      delIcon.setAttribute('tabindex', '0');
      delIcon.innerHTML = '<path d="M3 6h18v2H3V6zm2 3h14v11a2 2 0 01-2 2H7a2 2 0 01-2-2V9zm5-6h2v2h-2V3z"/>';
  
      delIcon.addEventListener('click', () => {
        if(confirm('¿Quieres eliminar esta tarea?')){
          div.style.animation = 'fadeOutLeft 0.3s forwards';
          div.addEventListener('animationend', () => {
            div.remove();
            saveTodos();
            updateEmptyMessage();
          });
        }
      });
  
      delIcon.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          delIcon.click();
        }
      });
  
      div.appendChild(textSpan);
      div.appendChild(delIcon);
      list.prepend(div);
      updateEmptyMessage();
      if(save) saveTodos();
    }
  
    newBtn.addEventListener('click', () => {
      const task = prompt('Introduce la nueva tarea:');
      if(task && task.trim() !== ''){
        createTodo(task.trim());
      }
    });
  
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeOutLeft {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(-30px); }
      }
    `;
    document.head.appendChild(style);
  
    loadTodos();
  })();
  