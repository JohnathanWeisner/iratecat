import React, { Component } from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import './App.css';
import Artwork from './components/Artwork';
import CategoryDropDown from './components/CategoryDropDown';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { users: [] };
  }

  componentDidMount() {
    fetch('/api/artwork/top/rating/3000')
      .then(res => res.json())
      .then(({data}) => this.setState({users: data}));
  }

  render() {
    let users = this.state.users;

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div>
          <AppBar title="Irate Cat" showMenuIconButton={false} >
            <CategoryDropDown/>
          </AppBar>
          <h1>Users</h1>
          {
            console.log(users),
            users.map((user) => {
              return (
                <Artwork key={user.id} {...user} />
              );
            })
          }
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
