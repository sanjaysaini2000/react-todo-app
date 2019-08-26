import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import NavBar from "./components/navBar";
import TodoItems from "./components/todoItems";
import Message from "./components/message";
import EditItem from "./components/editItem";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: []
    };
    this.addedItem = "";
    this.deletedItem = "";

    this.itemName = "";
    this.isItemAdded = false;
    this.isItemDeleted = false;
    this.isItemDone = false;
  }

  handleItemAdd(e, value, status) {
    this.setState(prevState => {
      return { items: prevState.items.concat(value) };
    });
    this.itemName = value.text;
    this.isItemAdded = status;
    e.preventDefault();
  }

  handleItemDelete(e, value, status) {
    this.itemName = value.text;
    this.isItemDeleted = status;
    this.setState(prevState => {
      return {
        items: prevState.items.filter(item => {
          return item.key !== value.key;
        })
      };
    });
    e.preventDefault();
  }

  handleItemStatusUpdate = (e, value, status) => {
    this.isItemDone = status === "Uncrossed" ? true : false;
    this.itemName = value.text;

    const items = [...this.state.items];
    const index = items.indexOf(value);
    items[index] = { ...value };
    items[index].status = this.isItemDone;

    this.setState({ items: items });
    e.preventDefault();
  };

  render() {
    let itemMsg;

    if (this.itemName !== "") {
      if (this.isItemAdded) {
        itemMsg = <Message msg={this.itemName + " successfully added...!!!"} />;
        this.isItemAdded = false;
      } else if (this.isItemDeleted) {
        itemMsg = (
          <Message msg={this.itemName + " successfully deleted...!!!"} />
        );
        this.isItemDeleted = false;
      } else if (this.isItemDone) {
        itemMsg = <Message msg={this.itemName + " is completed...!!!"} />;
        this.isItemDone = false;
      } else {
        itemMsg = <Message msg={this.itemName + " is not completed...!!!"} />;
        this.isItemDone = true;
      }
      this.itemName = "";
    }

    return (
      <Router>
        <div>
          <NavBar onAddItem={this.handleItemAdd.bind(this)} />
          <br />
          <div className="container">
            {itemMsg}
            <TodoItems
              name={this.state.items}
              onDeleteItem={this.handleItemDelete.bind(this)}
              onItemStatusUpdate={this.handleItemStatusUpdate}
            />
            <Route path="/edit/:itemname" exact strict component={EditItem} />
          </div>
        </div>
      </Router>
    );
  }
}
