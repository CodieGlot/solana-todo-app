import { useState } from "react";
import { toast } from "react-hot-toast";

type AddTodoFormProps = {
  addTodo: (content: string) => Promise<void>;
};

export function AddTodoForm({ addTodo }: AddTodoFormProps) {
  const [newItem, setNewItem] = useState("");

  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newItem !== "") {
      addTodo(newItem);
      setNewItem("");
    } else {
      toast.error("Task can not be empty!");
    }
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
