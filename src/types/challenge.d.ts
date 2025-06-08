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

export interface UpdatedChallenge {
  challengeId: number;
  newCategoryId: number;
  newChallengeTitle?: string;
  newChallengeTerm?: number;
  newChallengeDiff?: number;
  todosToAdd: {
    newTodoOrder: number;
    newTodoTitle: string;
  }[];
  todosToUpdate: {
    todoId: number;
    newTodoOrder: number;
    newTodoTitle: string;
  }[];
  todosToDelete: {
    todoId: number;
    newTodoStatus: number;
  }[];
}

export interface DeployChallenge {
  challengeId: number;
  newStatus: number;
}
