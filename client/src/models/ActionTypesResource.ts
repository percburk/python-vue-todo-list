// Enum of all action types used in vuex
export enum ActionTypes {
  // Sets all tasks in vuex state
  SET_TASKS = 'SET_TASKS',
  // Sets one task in vuex state for editing in EditDialog
  SET_ONE_TASK = 'SET_ONE_TASK',
  // Sets the string for the sorting of tasks from the db
  SET_SORT = 'SET_SORT',
  // Fetches all tasks from the db, sends along 'sort' if present for
  // different SQL 'ORDER BY' queries on server
  FETCH_TASKS = 'FETCH_TASKS',
  // Fetches one task for editing in EditDialog
  FETCH_ONE_TASK = 'FETCH_ONE_TASK',
  // Triggers post route for new task to db
  ADD_TASK = 'ADD_TASK',
  // Triggers put route to edit task on db
  EDIT_TASK = 'EDIT_TASK',
  // Triggers put route to toggle done status of task
  TOGGLE_DONE_TASK = 'TOGGLE_DONE_TASK',
  // Triggers put route to toggle priority setting, logic on server
  TOGGLE_TASK_PRIORITY = 'TOGGLE_TASK_PRIORITY',
  // Triggers a delete route to remove a task from the db
  DELETE_TASK = 'DELETE_TASK',
}
