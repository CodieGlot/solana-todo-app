type TodoItemProps = {
  idx: number;
  content: string;
  isCompleted: boolean;
  toggleTodo: (idx: number, completed: boolean) => void;
  deleteTodo: (idx: number) => void;
};

export function TodoItem({
  idx,
  content,
  isCompleted,
  toggleTodo,
  deleteTodo,
}: TodoItemProps) {
  return (
    <li>
      <label>
        <input
          type="checkbox"
          onChange={(e) => toggleTodo(idx, e.target.checked)}
          checked={isCompleted}
        />
        {content}
      </label>
      <button onClick={() => deleteTodo(idx)} className="btn btn-danger">
        Delete
      </button>
    </li>
  );
}
