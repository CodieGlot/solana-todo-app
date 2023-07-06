import { AddTodoForm, TodoList } from "./components/todo";
import "./styles.css";
import { useTodo } from "./hooks";
import { WalletConnectProvider } from "./components/wallet";
import { Loading } from "./components/states";

export default function App() {
  const {
    initialized,
    initializeUser,
    walletAddress,
    setWalletAddress,
    loading,
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
          <Loading loading={loading}>
            <TodoList
              title="Tasks"
              todos={incompletedTodos}
              todoActions={todoActions}
            />
            <TodoList
              title="Completed"
              todos={completedTodos}
              todoActions={todoActions}
            />
          </Loading>
        </>
      ) : (
        <button type="button" onClick={() => initializeUser()}>
          Initialize
        </button>
      )}
    </>
  );
}
