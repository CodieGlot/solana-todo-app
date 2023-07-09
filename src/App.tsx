import { Toaster } from "react-hot-toast";
import "./styles.css";
import { useTodo } from "./hooks";
import {
  InstallPhantomRedirect,
  WalletConnectProvider,
} from "./components/wallet";
import { AddTodoForm, TodoList } from "./components/todo";
import { Loading } from "./components/states";

export default function App() {
  const {
    initialized,
    initializeUser,
    walletAddress,
    setWalletAddress,
    phantomInstalled,
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
      {phantomInstalled && initialized ? (
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
      {!phantomInstalled && <InstallPhantomRedirect></InstallPhantomRedirect>}
      <Toaster position="bottom-center" />
    </>
  );
}
