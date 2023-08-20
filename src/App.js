import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [updateInputValue, setUpdateInputValue] = useState("");

  // CRUD with json-server

  // create = C
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:4000/todos", {
        id: todoList.length + 1,
        title: inputValue,
        isEdit: false,
        isComplete: false,
      });

      if (res.data) {
        setTodoList((prevState) => [...prevState, res.data]);
        setInputValue("");
      } else {
        alert("Something wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // read = R
  const getTodoList = async () => {
    try {
      const res = await axios.get("http://localhost:4000/todos");
      if (res.data) {
        setTodoList(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // delete = D
  const deleteHandler = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:4000/todos/${id}`);

      if (res.status === 200) {
        getTodoList();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isEditHandler = (curIndex) => {
    const todoItem = [...todoList];
    todoItem[curIndex].isEdit = true;
    setUpdateInputValue(todoItem[curIndex].title);
    setTodoList(todoItem);
  };

  // update = U
  const updateHandler = async ({ currentId, currentIndex }) => {
    try {
      const todoItem = [...todoList];
      todoItem[currentIndex] = {
        ...todoItem[currentIndex],
        title: updateInputValue,
        isEdit: false,
      };
      const res = await axios.put(
        `http://localhost:4000/todos/${currentId}`,
        todoItem[currentIndex]
      );
      if (res.status === 200) {
        getTodoList();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTodoList();
  }, []);

  return (
    <div className="container-fluid justify-content-center align-items-center">
      <h1 className="display-5 text-info text-uppercase fw-bold text-center">
        Todo List
      </h1>
      <form
        className="col-12 col-md-8 col-lg-6 mx-auto text-center my-3"
        onSubmit={submitHandler}
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required
          className="form-control p-3"
          placeholder="Enter new task"
        />
        <button type="submit" className="btn btn-primary btn-lg px-4 my-3">
          ADD
        </button>
      </form>

      <div className="col-12">
        {todoList.length === 0 && (
          <h6 className="text-danger text-center">Todo is empty!</h6>
        )}
        {todoList &&
          todoList.map((todo, index) => {
            return (
              <div
                className="col-12 col-md-8 col-lg-6 d-flex justify-content-center align-items-center bg-white border border-2 border-info rounded-2 shadow-sm p-4 my-3 mx-auto"
                key={todo.id}
              >
                <div className="col-6">
                  {!todo.isEdit && <span>{todo.title}</span>}
                  {todo.isEdit && (
                    <input
                      value={updateInputValue}
                      className="form-control"
                      onChange={(e) => setUpdateInputValue(e.target.value)}
                    />
                  )}
                </div>
                <div className="col-6 text-end">
                  {todo.isEdit ? (
                    <button
                      className="btn btn-warning mx-3"
                      onClick={() =>
                        updateHandler({
                          currentId: todo.id,
                          currentIndex: index,
                        })
                      }
                    >
                      Update
                    </button>
                  ) : (
                    <button
                      className="btn btn-warning mx-3"
                      onClick={() => isEditHandler(index)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="btn btn-danger mx-3"
                    onClick={() => deleteHandler(todo.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
