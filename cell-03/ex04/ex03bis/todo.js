$(function(){
  const $list = $('#ft_list');
  const $newBtn = $('#newBtn');
  const $emptyMsg = $('#emptyMessage');

  function saveTodos(){
    const todos = [];
    $list.children('.todo').each(function(){
      todos.push($(this).find('span').text());
    });
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
    if($list.children('.todo').length === 0){
      $emptyMsg.show();
    } else {
      $emptyMsg.hide();
    }
  }

  function createTodo(text, save = true){
    if(!text) return;

    const $div = $('<div>').addClass('todo').css({animation: 'fadeInUp 0.4s ease forwards'});
    const $span = $('<span>').text(text);
    const $delIcon = $(`
      <svg viewBox="0 0 24 24" width="20" height="20" class="delete-icon" role="button" tabindex="0" aria-label="Eliminar tarea" xmlns="http://www.w3.org/2000/svg" fill="white">
        <path d="M3 6h18v2H3V6zm2 3h14v11a2 2 0 01-2 2H7a2 2 0 01-2-2V9zm5-6h2v2h-2V3z"/>
      </svg>
    `);

    $delIcon.on('click', function(){
      if(confirm('¿Quieres eliminar esta tarea?')){
        $div.css({animation: 'fadeOutLeft 0.3s forwards'});
        $div.on('animationend webkitAnimationEnd', function(){
          $div.remove();
          saveTodos();
          updateEmptyMessage();
        });
      }
    });

    $delIcon.on('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        $(this).click();
      }
    });

    $div.append($span, $delIcon);
    $list.prepend($div);
    updateEmptyMessage();
    if(save) saveTodos();
  }

  $newBtn.on('click', function(){
    const task = prompt('Introduce la nueva tarea:');
    if(task && task.trim() !== ''){
      createTodo(task.trim());
    }
  });

  $('<style>')
    .text(`
      @keyframes fadeOutLeft {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(-30px); }
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(15px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `)
    .appendTo('head');

  loadTodos();
});
