import { useMemo, useState } from "react";
import { ITodo } from "../interfaces";

export function useTodo() {
  const [initialized, setInitialized] = useState(false);
  const [todos, setTodos] = useState<ITodo[]>([]);

  const initializeUser = () => {
    setInitialized(true);
  };

  const addTodo = (content: string) => {
    setTodos((current: ITodo[]) => {
      return [
        ...current,
        { id: crypto.randomUUID(), content, completed: false },
      ];
    });
  };

  const toggleTodo = (id: string, completed: boolean) => {
    setTodos((current: ITodo[]) => {
      return current.map((todo) =>
        todo.id === id ? { ...todo, completed } : todo
      );
    });
  };

  const deleteTodo = (id: string) => {
    setTodos((current: ITodo[]) => {
      return current.filter((todo) => todo.id !== id);
    });
  };

  const incompletedTodos = useMemo(
    () => todos.filter((todo) => !todo.completed),
    [todos]
  );
  const completedTodos = useMemo(
    () => todos.filter((todo) => todo.completed),
    [todos]
  );

  return {
    initialized,
    initializeUser,
    incompletedTodos,
    completedTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
}
