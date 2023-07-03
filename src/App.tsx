import { AddTodoForm, TodoList } from "./components/todo";
import "./styles.css";
import { useTodo } from "./hooks";
import { WalletConnectProvider } from "./components/wallet";

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
      <WalletConnectProvider></WalletConnectProvider>
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
