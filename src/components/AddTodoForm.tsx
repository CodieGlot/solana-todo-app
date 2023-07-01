import { useState } from "react";
import { ITodo } from "../interfaces";

type AddTodoFormProps = {
  setTodos: React.Dispatch<React.SetStateAction<ITodo[]>>;
};

export function AddTodoForm({ setTodos }: AddTodoFormProps) {
  const [newItem, setNewItem] = useState("");

  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setTodos((current: ITodo[]) => {
      return [
        ...current,
        { id: crypto.randomUUID(), content: newItem, completed: false },
      ];
    });

    setNewItem("");
  };

  return (
    <form onSubmit={handleAddItem} className="new-item-form">
      <div className="form-row">
        <label htmlFor="item">Add new task</label>
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          type="text"
          id="item"
        />
      </div>
      <button className="btn">Add</button>
    </form>
  );
}
