import React, { Component } from 'react';
import './App.css';

const createTodoObj = (title) => {
  return ({
    todoTitle: title,
    completed: false,
    edit: false
  });
}

//Returns the number of items not complete with formated text
const getItemsLeft = (arr) => {
  const items = arr.filter( todo => !todo.complete).length;
  return  items + (items > 1 ? " items left" : " item left");
}

//returns true or false if any items are marked 'complete'
const  anyComplete = (arr) => {
  return arr.length === 0 ? false : arr.filter( todo => todo.completed).length > 0;
}

//takes an array and removes all 'completed' items and returns that new array
const clearCompletedArray = (arr) => {
  let removed = false;
  arr.forEach( (todo, index) => {
    if(todo.completed) {
      arr.splice(index, 1);
      removed = true;
    }
  });
  return removed ? clearCompletedArray(arr) : arr;
}

const getFilteredArray = (arr, filter) => {
  switch(filter) {
    case 'active':
      return arr.filter( todo => !todo.completed );
    case 'completed':
      return arr.filter( todo => todo.completed );
    default:
      return arr;
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newTodo: '',
      todos: [], // todoTitle '', completed boolean
      filter: 'all'
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClearCompleted = this.handleClearCompleted.bind(this);
    this.handleFilterClick = this.handleFilterClick.bind(this);
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
      //if array is only one element, just reset it to a new array
      // - otherwise remove item at the id
      this.setState( {todos: this.state.todos.length === 1 ? [] : this.state.todos.slice().splice(todoID, 1)} );
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

  handleFilterClick(e) {
    if(e.target.name !== this.state.filter){
      this.setState( {filter: e.target.name} );
    }
  }

  handleClearCompleted() {
    this.setState( {todos: clearCompletedArray(this.state.todos.slice())});
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
        {getFilteredArray(this.state.todos.slice(), this.state.filter).map( (todo, index) => {
            return (
              <div
                className="row row-item"
                key={index}
                onMouseOver={ () => (document.getElementById("delete" + index).style.visibility = "visible")}
                onMouseLeave={() => (document.getElementById("delete" + index).style.visibility = "hidden")}
              >

                <div className="round">
                  <input
                    type="checkbox"
                    id={"checkbox" + index}
                    defaultChecked={todo.completed}
                    onClick={() => {
                      this.handleCheckChange(index);
                    }}
                  />
                  <label htmlFor={"checkbox" + index} />
                </div>

                <div className="todo-item" style={ {flexGrow: '2'} }>
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
                        className="todo-text"
                        style={ todo.completed ? {textDecoration: 'line-through'} : {textDecoration: 'none'} }
                        onDoubleClick={ () => {
                          this.handleDoubleClick(index);
                        }}
                    > { todo.todoTitle } </p>
                  }
                </div>

                <div>
                  <button
                    id={"delete" + index}
                    className="delete"
                    onClick={ () => {
                      this.handleDeleteClick(index);
                    }}
                  >X</button>
                </div>
              </div>
            );
        })}

        <div className="row row-filters" style={this.state.todos.length === 0 ? {visibility: 'hidden'} : {visibility: 'visible'}}>

          <div>{getItemsLeft(this.state.todos)}</div>

          <div className="filter-buttons">
              <button
                className={this.state.filter === 'all' ? 'selected' : ''}
                name="all"
                onClick={this.handleFilterClick}
              >All</button>

              <button
                className={this.state.filter === 'active' ? 'selected' : ''}
                name="active"
                onClick={this.handleFilterClick}
              >Acive</button>

              <button
                className={this.state.filter === 'completed' ? 'selected' : ''}
                name="completed"
                onClick={this.handleFilterClick}
              >Completed</button>
          </div>

          <div>
            <button
              id="clearCompleted"
              style={anyComplete(this.state.todos) ? {visibility: 'visible'} : {visibility: 'hidden'} }
              onClick={this.handleClearCompleted}
            >Clear Completed</button>
          </div>
        </div>

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
