import ReactDOM from 'react-dom';
import React from 'react';
import * as R from 'ramda';
import Atom from 'kefir.atom';
import Observe from './Observe';

const root = document.getElementById('root');

const todoList = Atom([]);
const finishedList = Atom([]);
const finishItem = item => {
  todoList.modify(list => {
    const index = list.findIndex(listItem => listItem === item);
    finishedList.modify(finishedList => finishedList.concat(item));
    return R.remove(index, 1, list);
  });
};
const unFinishItem = item => {
  finishedList.modify(list => {
    const index = list.findIndex(listItem => listItem === item);
    todoList.modify(todoList => todoList.concat(item));
    return R.remove(index, 1, list);
  });
};
const newItem = Atom('');

let id = 0;
const addItem = text => {
  todoList.modify(list => list.concat({ text, id: id++ }));
};

ReactDOM.render(
  <div>
    <div>
      <Observe observable={newItem}>
        {newItemText => (
          <form onSubmit={e => {
            e.preventDefault();
            addItem(newItemText);
            newItem.set('');
          }}>
            <div className="input-group">
              <label htmlFor="new-item-input">Add new To-Do item</label>
              <div className="input-group">
                <input
                  id="new-item-input"
                  type="text"
                  className="form-control"
                  value={newItemText}
                  onChange={e => newItem.set(e.target.value)}
                />
                <div className="input-group-append">
                  <button className="btn btn-outline-secondary" type="submit">Add Item</button>
                </div>
              </div>
            </div>
          </form>
        )}
      </Observe>
    </div>
    <h2>To Do</h2>
    <div>
      <Observe observable={todoList}>
        {list => (
          <ul className="list-group">
            {list.map(item => (
              <li className="list-group-item" key={item.id}>
                <div className="row">
                  <div className="col">{item.text}</div>
                  <div className="col col-xs-2">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => finishItem(item)}
                    >Complete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Observe>
    </div>
    <h2>Finished</h2>
    <div>
      <Observe observable={finishedList}>
        {list => (
          <ul className="list-group">
            {list.map(item => (
              <li className="list-group-item row" key={item.id}>
                <div className="row">
                  <div className="col">{item.text}</div>
                  <div className="col col-xs-2">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => unFinishItem(item)}
                    >Uncomplete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Observe>
    </div>
  </div>,
  root
);
