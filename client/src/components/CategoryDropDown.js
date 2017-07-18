import React, {Component, PropTypes} from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

const getStyles = (context) => {
  const spacing = context.muiTheme.baseTheme.spacing;
  const rightPadding = spacing.desktopGutterLess + spacing.desktopGutterMini;

  return {
    categoryStyle: {
      color: '#0097a7',
      fontSize: 17
    },
    category: {
      underlineStyle: {
        margin: `-1px ${spacing.iconSize}px 0px 0px`
      },
      labelStyle: {
        paddingLeft: 0,
        paddingRight: spacing.iconSize + rightPadding
      },
      iconStyle: {
        right: rightPadding +
          ((spacing.iconSize / 2) * -1)
      },
    },
    time: {
      underlineStyle: {
        margin: `-1px 0px 0px 0px`
      },
      labelStyle: {
        paddingLeft: 0,
        paddingRight: spacing.iconSize
      },
      iconStyle: {
        right: (spacing.iconSize / 2) * -1
      },
      customWidth: {
        width: 80
      }
    }
  }
};

export default class CategoryDropDown extends Component {

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      category: 2,
      time: 1,
    };
  }

  handleCategoryChange = (event, index, value) => {
    const categoryLabels = [1, 4, 8, 12];

    if (categoryLabels.includes(value)) {
      value += 1;
    }

    this.setState({category: value});
  }

  handleTimeChange = (event, index, value) => {
    this.setState({time: value});
  }

  render() {
    const styles = getStyles(this.context);

    return (
      <div>
        <DropDownMenu 
          value={this.state.category}
          onChange={this.handleCategoryChange}
          underlineStyle={styles.category.underlineStyle}
          labelStyle={styles.category.labelStyle}
          iconStyle={styles.category.iconStyle}
        >
          <MenuItem value={1} primaryText='Posts' style={styles.categoryStyle}/>
          <MenuItem value={2} label='Top Posts' primaryText='Top' />
          <MenuItem value={3} label='New Posts' primaryText='New' />
          <MenuItem value={4} primaryText='Artwork' style={styles.categoryStyle}/>
          <MenuItem value={5} label='Hidden Gems' primaryText='Hidden Gems' />
          <MenuItem value={6} label='Top Art' primaryText='Top' />
          <MenuItem value={7} label='New Art' primaryText='New' />
          <MenuItem value={8} primaryText='Artists' style={styles.categoryStyle}/>
          <MenuItem value={9} label='Top Artists' primaryText='Highest Rated' />
          <MenuItem value={10} label='Awarded Artists' primaryText='Most Awards' />
          <MenuItem value={11} primaryText='Most Artwork' />
          <MenuItem value={12} primaryText='Posters' style={styles.categoryStyle}/>
          <MenuItem value={13} label='Top Posters' primaryText='Highest Rated' />
          <MenuItem value={14} label='Awarded Posters' primaryText='Most Awarded' />
        </DropDownMenu>
        <DropDownMenu
          value={this.state.time}
          onChange={this.handleTimeChange}
          style={styles.time.customWidth}
          underlineStyle={styles.time.underlineStyle}
          labelStyle={styles.time.labelStyle}
          iconStyle={styles.time.iconStyle}
        >
          <MenuItem value={1} primaryText="24 hrs" />
          <MenuItem value={2} primaryText="7 days" />
          <MenuItem value={3} primaryText="1 month" />
          <MenuItem value={4} primaryText="1 year" />
          <MenuItem value={5} primaryText="all time" />
        </DropDownMenu>
      </div>
    );
  }
}