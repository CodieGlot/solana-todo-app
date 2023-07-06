import { AddTodoForm, TodoList } from "./components/todo";
import "./styles.css";
import { useTodo } from "./hooks";
import { WalletConnectProvider } from "./components/wallet";

export default function App() {
  const {
    initialized,
    initializeUser,
    walletAddress,
    setWalletAddress,
    incompletedTodos,
    completedTodos,
    todoActions,
  } = useTodo();

  return (
    <>
      <WalletConnectProvider
        walletAddress={walletAddress}
        setWalletAddress={setWalletAddress}
      ></WalletConnectProvider>
      {initialized ? (
        <>
          <AddTodoForm {...todoActions} />
          <TodoList title="Tasks" todos={incompletedTodos} {...todoActions} />
          <TodoList title="Completed" todos={completedTodos} {...todoActions} />
        </>
      ) : (
        <button type="button" onClick={() => initializeUser()}>
          Initialize
        </button>
      )}
    </>
  );
}
