import { ITodo } from "../../interfaces";
import { TodoItem } from "./TodoItem";

type TodoListProps = {
  title: string;
  todos: ITodo[];
  todoActions: {
    toggleTodo: (idx: number, isCompleted: boolean) => Promise<void>;
    deleteTodo: (idx: number) => Promise<void>;
  };
};

export function TodoList({ title, todos, todoActions }: TodoListProps) {
  return (
    <>
      <h1>
        {title} - {todos.length}
      </h1>
      <ul className="list">
        {todos.map((todo) => {
          return <TodoItem {...todo} {...todoActions} key={todo.idx} />;
        })}
      </ul>
    </>
  );
}
