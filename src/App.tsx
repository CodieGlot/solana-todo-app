import { useState } from "react";
import { AddTodoForm } from "./components/AddTodoForm";
import { TodoList } from "./components/TodoList";
import "./styles.css";
import { ITodo } from "./interfaces";

export default function App() {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [todos, setTodos] = useState<ITodo[]>([]);

  return (
    <>
      {initialized ? (
        <>
          <AddTodoForm setTodos={setTodos} />
          <TodoList todos={todos} setTodos={setTodos} />
        </>
      ) : (
        <button type="button" onClick={() => setInitialized(true)}>
          Initialize
        </button>
      )}
    </>
  );
}
