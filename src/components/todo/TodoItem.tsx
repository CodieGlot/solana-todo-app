type TodoItemProps = {
  idx: number;
  content: string;
  isCompleted: boolean;
  toggleTodo: (idx: number) => Promise<void>;
  deleteTodo: (idx: number) => Promise<void>;
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
          onChange={() => toggleTodo(idx)}
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
