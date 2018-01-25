import React, { Component } from 'react';
import './App.css';

const createTodoObj = (title) => {
  return ({
    todoTitle: title,
    completed: false,
    edit: false
  });
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newTodo: '',
      todos: [ ] // todoTitle '', completed boolean

    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e) {
    this.setState( {newTodo: e.target.value} );
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState( {todos: this.state.todos.concat([createTodoObj(this.state.newTodo)]), newTodo: ''} );
  }

  handleCheckChange(todoID) {
    const newArray = this.state.todos.slice(); //this creates a COPY of the array, not a reference to this.state.todos
    newArray[todoID].completed = !newArray[todoID].completed;
    this.setState( {todos: newArray});
  }

  handleDeleteClick(todoID) {
    if (todoID !== -1) {
      this.setState( {todos: this.state.todos.slice().splice(todoID, 1)} );
    }
  }

  handleDoubleClick(todoID) {
    const newArray = this.state.todos.slice();
    newArray[todoID].edit = true;
    this.setState( {todos: newArray} );
  }

  handleUpdateItem(todoID, newTitle) {
    const newArray = this.state.todos.slice();
    newArray[todoID].todoTitle = newTitle;
    newArray[todoID].edit = false;
    this.setState( {todos: newArray} );
  }



  render() {
    return (
      <div className="App">

        <header>
          <h1>{this.props.title}</h1>
        </header>
          <div className="row">
            <form onSubmit={this.handleSubmit}  >
                <input
                  type="text"
                  value={this.state.newTodo}
                  placeholder="What needs to be done?"
                  onInput={this.handleInputChange}
                  style={ {width: '90%'}}
                />
            </form>
          </div>
        {
          this.state.todos.map( (todo, index) => {
            return (
              <div className="row" key={index}>
              <div>
                <input
                  type="checkbox"
                  onClick={() => {
                    this.handleCheckChange(index);
                  }}
                />
              </div>

              <div>
                {
                  todo.edit ?
                    <input
                      type="text"
                      defaultValue={todo.todoTitle}
                      className="border"
                      onBlur={ (e)  =>( this.handleUpdateItem(index, e.target.value)) }
                      onKeyUp={ (e) => ( e.key === 'Enter' ? this.handleUpdateItem(index, e.target.value) : '' )}
                    /> :
                    <p
                      style={ todo.completed ? {display: 'inline', textDecoration: 'line-through'} : {display: 'inline', textDecoration: 'none'} }
                      onDoubleClick={ () => {
                        this.handleDoubleClick(index);
                      }}
                  > { todo.todoTitle } </p>
                }
              </div>

              <div>
                <button
                  className="delete"
                  onClick={ () => {
                    this.handleDeleteClick(index);
                  }}
                >X</button>
              </div>
            </div>
            );
          })
        }

        <footer>
          <p style={ {marginBottom: '10px'} }>Double-click to edit a todo</p>
          <p>Created by Del, Angela, and Andy</p>
          <p>Creatively copied from todomvc.com</p>
        </footer>
      </div>
    );
  }
}

export default App;
