import React, { Component } from 'react';
import './App.css';

const createTodoObj = (title,completed) => { 
  return ({ todoTitle: title,
           completed: completed
  });
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newTodo: '',
      todos: [ ] // todoTitle '', completed boolan
      
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(e) {
    this.setState( {newTodo: e.target.value} );

  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState( {todos: this.state.todos.concat([createTodoObj(this.state.newTodo, false)]), newTodo: ''} );
    
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
                />
            </form>
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
