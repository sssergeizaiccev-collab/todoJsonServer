import { useState } from "react";
import "./App.css";
import styles from "./app.module.css";
import { useTodos } from "./hook/useTodos";
import { useDebounce } from "./hook/useDebounce";

function App() {
  const [input, setInput] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [isSorted, setIsSorted] = useState(false);
  const { todos, isLoaded, error, addTodoo, deleteTodo, updateTodo } =
    useTodos();
  const debouncedSearch = useDebounce(search, 500);

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const displayedTodos = isSorted
    ? [...filteredTodos].sort((a, b) => a.title.localeCompare(b.title))
    : filteredTodos;

  return (
    <div className={styles.app}>
      <h2>Задачи на сегодня</h2>

      <input
        value={input}
        placeholder="Вdедите задачу"
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={() => {
          (addTodoo(input), setInput(""));
        }}
      >
        Добавить
      </button>

      <div className={styles.searchBlock}>
        <input
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск..."
        />

        <button
          className={`${styles.sortButton} ${isSorted ? styles.sortButtonActive : ""}`}
          onClick={() => setIsSorted((prev) => !prev)}
        >
          {isSorted ? "Отлючить сортировку" : "Сортировка по алфавиту"}
        </button>
      </div>

      {isLoaded && <div>Загрузка...</div>}
      {error && <div>{error}</div>}

      {!isLoaded &&
        !error &&
        displayedTodos.map(({ id, title }) => (
          <div key={id} className={styles.todo}>
            {editingId === id ? (
              <>
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <button
                  onClick={() => {
                    (updateTodo(id, editValue),
                      setEditValue(""),
                      setEditingId(null));
                  }}
                >
                  Сохранить
                </button>
              </>
            ) : (
              <>
                <span>{title}</span>
                <button
                  onClick={() => {
                    (setEditValue(title), setEditingId(id));
                  }}
                >
                  Редактировать
                </button>
                <button onClick={() => deleteTodo(id)}>Удалить</button>
              </>
            )}
          </div>
        ))}
    </div>
  );
}

export default App;
