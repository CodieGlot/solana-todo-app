import { AddTodoForm } from "./components/AddTodoForm";
import { TodoList } from "./components/TodoList";
import "./styles.css";
import { useTodo } from "./hooks";

export default function App() {
  const {
    initialized,
    initializeUser,
    incompletedTodos,
    completedTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
  } = useTodo();

  return (
    <>
      {initialized ? (
        <>
          <AddTodoForm addTodo={addTodo} />
          <TodoList
            title="Tasks"
            todos={incompletedTodos}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
          />
          <TodoList
            title="Completed"
            todos={completedTodos}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
          />
        </>
      ) : (
        <button type="button" onClick={() => initializeUser()}>
          Initialize
        </button>
      )}
    </>
  );
}
