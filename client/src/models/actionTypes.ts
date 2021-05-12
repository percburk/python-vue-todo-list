// Enum of all action types used in vuex
export enum actionTypes {
  // Sets all tasks in vuex state
  setTasks = 'SET_TASKS',
  // Sets one task in vuex state for editing in EditDialog
  setOneTask = 'SET_ONE_TASK',
  // Sets the string for the sorting of tasks from the db
  setSort = 'SET_SORT',
  // Fetches all tasks from the db, sends along 'sort' if present for 
  // different SQL 'ORDER BY' queries on server
  fetchTasks = 'FETCH_TASKS',
  // Fetches one task for editing in EditDialog
  fetchOneTask = 'FETCH_ONE_TASK',
  // Triggers post route for new task to db
  addTask = 'ADD_TASK',
  // Triggers put route to edit task on db
  editTask = 'EDIT_TASK',
  // Triggers put route to toggle done status of task
  toggleDoneTask = 'TOGGLE_DONE_TASK',
  // Triggers put route to toggle priority setting, logic on server
  toggleTaskPriority = 'TOGGLE_TASK_PRIORITY',
  // Triggers a delete route to remove a task from the db
  deleteTask = 'DELETE_TASK',
}
