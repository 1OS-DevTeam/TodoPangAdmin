export interface Todo {
  lastUpdatedAt: string;
  lastUpdatedBy: string;
  todoId: number;
  todoOrder: number;
  todoTitle: string;
}

export interface Challenge {
  categoryId: number;
  challengeDiff: number;
  challengeId: number;
  challengeName: string;
  challengeStatus: number;
  challengeTerm: number;
  challengeTodoCount: number;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
  todoList: Todo[];
}
