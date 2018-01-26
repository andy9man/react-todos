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

const allChecked = (arr) => {
  let allCheck = true;
  arr.forEach( todo => {
    if(!todo.completed) {
      allCheck = false;
    }
  });
  return allCheck;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newTodo: '',
      todos: [],
      filter: 'all',
      allChecked: false
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheckAllToggle = this.handleCheckAllToggle.bind(this);
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

  handleCheckAllToggle() {
    const checked = !allChecked(this.state.todos.slice());
    const newTodoArray = this.state.todos.map( todo => {
      return {todoTitle: todo.todoTitle, completed: checked, edit: todo.edit};
    });
    console.log(newTodoArray);
    this.setState( {todos: newTodoArray, allChecked: checked} );
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
      this.setState( {filter: e.target.name, allChecked: false} );
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
            <button
              className="down-arrow"
              onClick={this.handleCheckAllToggle}
              style={this.state.todos.length === 0 ? {visibility: 'hidden'} : {visibility: 'visible'}}
            >
              <i
                className="fa fa-angle-down down-arrow"
                style={this.state.allChecked ? {color: '#BDBDBD'} : {color: '#49474B'}}
              />
            </button>
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
              <TodoRow
                key={index}
                rowId={index}
                todoItem={todo}
                handleCheckChange={this.handleCheckChange}
                handleUpdateItem={this.handleUpdateItem}
                handleDoubleClick={this.handleDoubleClick}
                handleDeleteClick={this.handleDeleteClick}
              />
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

class TodoRow extends Component {

  render() {
    return (

      <div
        className="row row-item"
        onMouseOver={ () => (document.getElementById("delete" + this.props.rowId).style.visibility = "visible")}
        onMouseLeave={() => (document.getElementById("delete" + this.props.rowId).style.visibility = "hidden")}
      >

        <div className="round">
          <input
            type="checkbox"
            id={"checkbox" + this.props.rowId}
            checked={this.props.todoItem.completed}
            onClick={() => {
              this.props.handleCheckChange(this.props.rowId);
            }}
          />
          <label htmlFor={"checkbox" + this.props.rowId} />
        </div>

        <div className="todo-item" style={ {flexGrow: '2'} }>
          {
            this.props.todoItem.edit ?
              <input
                type="text"
                defaultValue={this.props.todoItem.todoTitle}
                className="border"
                onBlur={ (e)  =>( this.props.handleUpdateItem(this.props.rowId, e.target.value)) }
                onKeyUp={ (e) => ( e.key === 'Enter' ? this.props.handleUpdateItem(this.props.rowId, e.target.value) : '' )}
              /> :
              <p
                className="todo-text"
                style={ this.props.todoItem.completed ? {textDecoration: 'line-through'} : {textDecoration: 'none'} }
                onDoubleClick={ () => {
                  this.props.handleDoubleClick(this.props.rowId);
                }}
            > { this.props.todoItem.todoTitle } </p>
          }
        </div>

        <div>
          <button
            id={"delete" + this.props.rowId}
            className="delete"
            onClick={ () => {
              this.props.handleDeleteClick(this.props.rowId);
            }}
          >&#x2715;</button>
        </div>

      </div>

    );
  }
}

export default App;
