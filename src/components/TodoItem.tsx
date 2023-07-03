type TodoItemProps = {
  id: string;
  content: string;
  completed: boolean;
  toggleTodo: (id: string, completed: boolean) => void;
  deleteTodo: (id: string) => void;
};

export function TodoItem({
  id,
  content,
  completed,
  toggleTodo,
  deleteTodo,
}: TodoItemProps) {
  return (
    <li>
      <label>
        <input
          type="checkbox"
          onChange={(e) => toggleTodo(id, e.target.checked)}
          checked={completed}
        />
        {content}
      </label>
      <button onClick={() => deleteTodo(id)} className="btn btn-danger">
        Delete
      </button>
    </li>
  );
}
