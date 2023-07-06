import { ITodo } from "../../interfaces";
import { TodoItem } from "./TodoItem";

type TodoListProps = {
  title: string;
  todos: ITodo[];
  toggleTodo: (idx: number, completed: boolean) => void;
  deleteTodo: (idx: number) => void;
};

export function TodoList({
  title,
  todos,
  toggleTodo,
  deleteTodo,
}: TodoListProps) {
  return (
    <>
      <h1>{title}</h1>
      <ul className="list">
        {todos.map((todo) => {
          return (
            <TodoItem
              {...todo}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              key={todo.idx}
            />
          );
        })}
      </ul>
    </>
  );
}
