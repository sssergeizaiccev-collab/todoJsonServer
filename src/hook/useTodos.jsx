import { useState, useEffect } from "react";

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3005/todos")
      .then((res) => res.json())
      .then((loadedTodos) => {
        setTodos(loadedTodos);
      });
  }, []);

  const addTodoo = async (title) => {
    if (!title.trim()) return;

    try {
      setIsLoaded(true);
      setError(null);

      const res = await fetch("http://localhost:3005/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) {
        throw new Error("Ошибка добавления задачи");
      }

      const newTodo = await res.json();
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoaded(false);
    }
  };

  const deleteTodo = async (id) => {
    try {
      setIsLoaded(true);
      setError(null);

      const res = await fetch(`http://localhost:3005/todos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Ошибка удаления");
      }

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoaded(false);
    }
  };

  const updateTodo = async (id, title) => {
    try {
      setIsLoaded(true);
      setError(null);

      const res = await fetch(`http://localhost:3005/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) {
        throw new Error("Ошибка редактирования");
      }

      const updated = await res.json();

      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, ...updated } : todo)),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoaded(false);
    }
  };

  return {
    todos,
    isLoaded,
    error,
    addTodoo,
    deleteTodo,
    updateTodo,
  };
};
