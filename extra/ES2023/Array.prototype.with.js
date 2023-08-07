function App() {
  const [todos, setTodos] = useState([]);

  function toggleTodo(index) {
    const newTodos = todos.with(index, {
      ...todos[index],
      done: !todos[index].done,
    });
    setTodos(newTodos);
  }

  return <ListTodos todos={todos} onCheckboxClick={toggleTodo}></ListTodos>;
}
