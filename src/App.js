import React, { Component } from 'react';
import './App.css';

//HELPFER FUNCTION:  Give me a Todo Object
const createTodoObj = (title) => {
  return ({
    id: Date.now(),
    todoTitle: title,
    completed: false,
    edit: false
  });
}

//HELPER FUNCTION:  Returns the ID where the element ID resides in the array
const getArrayId = (arr, id) => {
  for( let i = 0; i < arr.length; i++) {
    if(arr[i].id === id) {
      return i;
    }
  }
  return "We didn't find it";
}

//HELPER FUNCTION:  Returns the number of items not complete with formated text
const getItemsLeft = (arr) => {
  const items = arr.filter( todo => !todo.completed).length;
  return  items + (items === 1 ? " item left": " items left");
}

//HELPER FUNCTION: Returns true or false if any items are marked 'complete'
const  anyComplete = (arr) => {
  return arr.length === 0 ? false : arr.filter( todo => todo.completed).length > 0;
}

//HELPER FUNCTION:  Takes an array and removes all 'completed' items and returns that new array
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

//HELPER FUNCTION:  Returns a filtered array based on some criteria
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

//HELPER FUNCTION:  Return an array that is checked
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
    this.handleUpdateItem = this.handleUpdateItem.bind(this);
  }

  handleInputChange(e) {
    this.setState( {newTodo: e.target.value} );
  }

  handleSubmit(e) {
    e.preventDefault();
    if(this.state.newTodo.trim() !== '') {
      this.setState( {todos: this.state.todos.concat([createTodoObj(this.state.newTodo)]), newTodo: ''} );
    }
  }

  handleCheckAllToggle() {
    const checked = !allChecked(this.state.todos.slice());
    const newTodoArray = this.state.todos.map( todo => {
      return {todoTitle: todo.todoTitle, completed: checked, edit: todo.edit};
    });
    console.log(newTodoArray);
    this.setState( {todos: newTodoArray, allChecked: checked} );
  }

  handleCheckChange(todoId) {
    console.log("Marking Todo Item: " + todoId);
    const newArray = this.state.todos.slice(); //this creates a COPY of the array, not a reference to this.state.todos
    console.log(getArrayId(newArray, todoId));
    newArray[ getArrayId(newArray, todoId) ].completed = !newArray[ getArrayId(newArray, todoId) ].completed;
    this.setState( {todos: newArray});
    console.log(todoId);
  }

  handleDeleteClick(todoId) {
    if ( !isNaN(todoId) ) {
      const index = getArrayId(this.state.todos.slice(), todoId);

      console.log("Deleting Todo Item: " + todoId);
      console.log("Todo Item ID: " + index);

      //arr = (this.state.todos.length === 1 ? [] : arr.splice( index, 1));
      //if array is only one element, just reset it to a new array
      // - otherwise remove item at the id
      let arr = this.state.todos.slice();
      arr.length > 1 ? arr.splice(index, 1) : arr = [];
      return this.setState({ todos: arr});
    }
  }

  handleDoubleClick(todoId) {
    if( !isNaN(todoId) ) {
      let arr = this.state.todos.slice();
      console.log("Attempting to edit: " + todoId)
      const index = getArrayId( arr, todoId);
      arr[index].edit = true;
      this.setState( {todos: arr} );
    }
  }

  handleUpdateItem(todoId, newTitle) {
    if( !isNaN(todoId) ) {
      let arr = this.state.todos.slice();
      const index = getArrayId( arr, todoId);
      console.log("Editing item: " + todoId + "\nCurrent: " + arr[index].todoTitle + "\nNew: " + newTitle);
      arr[index].todoTitle = newTitle;
      arr[index].edit = false;
      this.setState( {todos: arr} );
    }
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


        <TodoFilter
          showFilter={this.state.todos.length === 0 ? {visibility: 'hidden'} : {visibility: 'visible'}}
          filter={this.state.filter}
          itemsLeft={getItemsLeft(this.state.todos.slice())}
          showClearCompleted={anyComplete(this.state.todos) ? {visibility: 'visible'} : {visibility: 'hidden'} }
          handleClearCompleted={this.handleClearCompleted}
          handleFilterClick={this.handleFilterClick}
        />

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
            onChange={() => {
              this.props.handleCheckChange(this.props.todoItem.id);
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
                onBlur={ (e)  =>( this.props.handleUpdateItem(this.props.todoItem.id, e.target.value)) }
                onKeyUp={ (e) => ( e.key === 'Enter' ? this.props.handleUpdateItem(this.props.todoItem.id, e.target.value) : '' )}
              /> :
              <p
                className="todo-text"
                style={ this.props.todoItem.completed ? {textDecoration: 'line-through'} : {textDecoration: 'none'} }
                onDoubleClick={ () => {
                  this.props.handleDoubleClick(this.props.todoItem.id);
                }}
            > { this.props.todoItem.todoTitle } </p>
          }
        </div>

        <div>
          <button
            id={"delete" + this.props.rowId}
            className="delete"
            onClick={ () => {
              this.props.handleDeleteClick(this.props.todoItem.id);
            }}
          >&#x2715;</button>
        </div>

      </div>

    );
  }
}

class TodoFilter extends Component {

  render() {
    return (

      <div className="row row-filters" style={this.props.showFilter}>

        <div>{this.props.itemsLeft}</div>

        <div className="filter-buttons">
          <button
            className={this.props.filter === 'all' ? 'selected' : ''}
            name="all"
            onClick={this.props.handleFilterClick}
          >All</button>

          <button
            className={this.props.filter === 'active' ? 'selected' : ''}
            name="active"
            onClick={this.props.handleFilterClick}
          >Acive</button>

          <button
            className={this.props.filter === 'completed' ? 'selected' : ''}
            name="completed"
            onClick={this.props.handleFilterClick}
          >Completed</button>
        </div>

        <div>
          <button
            id="clearCompleted"
            style={this.props.showClearCompleted}
            onClick={this.props.handleClearCompleted}
          >Clear Completed</button>
        </div>
      </div>
    );
  }
}

export default App;
