import { ITodo } from "../interfaces";

type TodoItemProps = {
  id: string;
  content: string;
  completed: boolean;
  setTodos: React.Dispatch<React.SetStateAction<ITodo[]>>;
};

export function TodoItem({ id, content, setTodos }: TodoItemProps) {
  const toggleTodo = (id: string, completed: boolean) => {
    setTodos((current) => {
      return current.map((todo) => {
        return todo.id === id ? { ...todo, completed } : todo;
      });
    });
  };

  const deleteTodo = (id: string) => {
    setTodos((current) => {
      return current.filter((todo) => todo.id !== id);
    });
  };

  return (
    <li>
      <label>
        <input
          type="checkbox"
          onChange={(e) => toggleTodo(id, e.target.checked)}
        />
        {content}
      </label>
      <button onClick={() => deleteTodo(id)} className="btn btn-danger">
        Delete
      </button>
    </li>
  );
}
