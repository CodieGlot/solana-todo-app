import { ITodo } from "../interfaces";
import { TodoItem } from "./TodoItem";

type TodoListProps = {
  todos: ITodo[];
  setTodos: React.Dispatch<React.SetStateAction<ITodo[]>>;
};

export function TodoList({ todos, setTodos }: TodoListProps) {
  return (
    <>
      <h1>Tasks</h1>
      <ul className="list">
        {todos
          .filter((todo) => !todo.completed)
          .map((todo) => {
            return <TodoItem {...todo} setTodos={setTodos} key={todo.id} />;
          })}
      </ul>
      <h1>Completed</h1>
      <ul className="list">
        {todos
          .filter((todo) => todo.completed)
          .map((todo) => {
            return <TodoItem {...todo} setTodos={setTodos} key={todo.id} />;
          })}
      </ul>
    </>
  );
}
