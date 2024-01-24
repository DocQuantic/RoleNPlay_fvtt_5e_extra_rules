/**
 * A single ToDo in our list of Todos.
 * @typedef {Object} ToDo
 * @property {string} id - A unique ID to identify this todo.
 * @property {string} label - The text of the todo.
 * @property {boolean} isDone - Marks whether the todo is done.
 * @property {string} userId - The user who owns this todo.
 */

/**
 * A class which holds some constants for todo-list
 */

class ToDoList {
    static ID = 'todo-list';
    
    static FLAGS = {
      TODOS: 'todos'
    }
    
    static TEMPLATES = {
      TODOLIST: `modules/${this.ID}/templates/todo-list.hbs`
    }

    /**
     * A small helper function which leverages developer mode flags to gate debug logs.
     * 
     * @param {boolean} force - forces the log even if the debug flag is not on
     * @param  {...any} args - what to log
     */
    static log(force, ...args) {  
        const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);
    
        if (shouldLog) {
          console.log(this.ID, '|', ...args);
        }
    }
}

class ToDoListData {
    static getToDosForUser(userId) {
        return game.users.get(userId)?.getFlag(ToDoList.ID, ToDoList.FLAGS.TODOS);
    }

    static createToDo(userId, toDoData) {
        // generate a random id for this new ToDo and populate the userId
        const newToDo = {
          isDone: false,
          ...toDoData,
          id: foundry.utils.randomID(16),
          userId,
        }
    
        // construct the update to insert the new ToDo
        const newToDos = {
          [newToDo.id]: newToDo
        }
    
        // update the database with the new ToDos
        return game.users.get(userId)?.setFlag(ToDoList.ID, ToDoList.FLAGS.TODOS, newToDos);
    }

    static get allToDos() {
        const allToDos = game.users.reduce((accumulator, user) => {
          const userTodos = this.getToDosForUser(user.id);
    
          return {
            ...accumulator,
            ...userTodos
          }
        }, {});
    
        return allToDos;
    }

    static updateToDo(toDoId, updateData) {
        const relevantToDo = this.allToDos[toDoId];
    
        // construct the update to send
        const update = {
          [toDoId]: updateData
        }
    
        // update the database with the updated ToDo list
        return game.users.get(relevantToDo.userId)?.setFlag(ToDoList.ID, ToDoList.FLAGS.TODOS, update);
    }

    static deleteToDo(toDoId) {
        const relevantToDo = this.allToDos[toDoId];
    
        // Foundry specific syntax required to delete a key from a persisted object in the database
        const keyDeletion = {
          [`-=${toDoId}`]: null
        }
    
        // update the database with the updated ToDo list
        return game.users.get(relevantToDo.userId)?.setFlag(ToDoList.ID, ToDoList.FLAGS.TODOS, keyDeletion);
    }

    static updateUserToDos(userId, updateData) {
        return game.users.get(userId)?.setFlag(ToDoList.ID, ToDoList.FLAGS.TODOS, updateData);
      }
}

Hooks.on('renderActorSheet', (actorSheet5eCharacter, html) => {
  console.log('todo-list | Hello World!');

  const loggedInUserListItem = html.find(`[class="ability "]`);

  loggedInUserListItem.append(
    "<a class='wound-button' data-action='wound'><img class='wound-image' src='modules/RoleNPlay_fvtt_5e_extra_rules/icons/arm-sling.svg'></a>"
  );
});

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(ToDoList.ID);
});