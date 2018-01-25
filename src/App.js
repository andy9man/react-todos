import React, { Component } from 'react';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newTodo: '',
      todos: []
    }

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e) {
    this.setState( {newTodo: e.target.value} );
  }

  render() {
    return (
      <div className="App">

        <header>
          <h1>{this.props.title}</h1>
        </header>
          <div className="row">
            <input
              type="text"
              value={this.state.newTodo}
              placeholder="What needs to be done?"
              onInput={this.handleInputChange}
            />
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
