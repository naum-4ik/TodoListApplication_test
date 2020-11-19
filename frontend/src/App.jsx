import React from "react";
import ToDoList from "./components/ToDoList/ToDoList";
import "./App.css";
//import Todos from './components/ToDoItem/Todo';
//import AddTodo from './components/ToDoForm/TodoForm';
import qs from 'qs';
import axios from 'axios';

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const LOCAL_STORAGE_KEY = 'App.todos';



const customTheme = createMuiTheme({
  palette: {
    primary: {
      light: "#7c42bd",
      main: "#4a138c",
      dark: "#12005e",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#f95688",
      main: "#c1185b",
      dark: "#8b0032",
      contrastText: "#ffffff",
    },
  },
});

export default class App extends React.Component {

  state = {
    todos: []
  }

  // GET Todos from REST API and Restore todos from localStorage on component startup
  componentDidMount = () => {
    const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedTodos) {
      this.setState({
        todos: storedTodos
      })
    }

    axios.get('/api/todos')
      .then((res) => this.setState({ todos: res.data }))
      .catch((err) => console.log(err));
  }

  // Save todos to localStorage everytime component updates
  componentDidUpdate = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.state.todos), this.state.todos)
  }

  // Toggle Complete
  toggleComplete = (_id, title, completed) => {
    completed = !completed

    axios.put(`/api/todos/${_id}`, qs.stringify({
      title,
      completed
    }))
      .then(res => {
        this.setState({
          todos: this.state.todos.map((todo) => {
            if (todo._id === _id) {
              todo.completed = !todo.completed
            }
            return todo;
          })
        });
      })
      .catch(err => {
        console.log(err)
      });
  }

  // Delete Todo
  delTodo = (_id) => {
    axios.delete(`/api/todos/${_id}`)
      .then(res => this.setState({
        todos: [...this.state.todos.filter((todo) => todo._id !== _id)]
      }))
      .catch(err => console.log(err));
  }

  // Add Todo
  addTodo = (title) => {
    axios.post('/api/todos', qs.stringify({
      title,
      completed: false
    }))
      .then(res => this.setState({
        todos: [...this.state.todos, res.data]
      }))
      .catch(err => {
        console.log(err);
      })
  }
  render() {
    return (
      <ThemeProvider theme={customTheme}>
        <div className="App">
          <ToDoList />
        </div>
      </ThemeProvider>
    );
  }
}
