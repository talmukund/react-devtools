
var React = require('react');
var Node = require('./node');

var decorate = require('./decorate');

var MAX_ROOTS = 200;

class TreeView extends React.Component {
  getChildContext() {
    return {
      scrollTo: this.scrollTo.bind(this),
    };
  }

  scrollTo(val, height) {
    var node = React.findDOMNode(this);
    var top = node.scrollTop;
    var rel = val - node.offsetTop;
    var margin = 40;
    if (top > rel - margin) {
      node.scrollTop = rel - margin;
    } else if (top + node.offsetHeight < rel + height + margin) {
      node.scrollTop = rel - node.offsetHeight + height + margin;
    }
  }

  render() {
    return (
      <div style={styles.container}>
        {!this.props.roots.count() &&
          <span>Waiting for roots to load...</span>}
        {this.props.roots.slice(0, MAX_ROOTS).map(id => (
          <Node key={id} id={id} depth={0} />
        )).toJS()}
        {this.props.roots.count() > MAX_ROOTS &&
          <span>Some results not shown. Narrow your search criteria to find them</span>}
      </div>
    );
  }
}

TreeView.childContextTypes = {
  scrollTo: React.PropTypes.func,
}

var styles = {
  container: {
    padding: 3,
    overflow: 'auto',
    fontFamily: 'monospace',
    fontSize: '12px',
    flex: 1,

    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    MsUserSelect: 'none',
    userSelect: 'none',
  },
};

var WrappedTreeView = decorate({
  listeners(props) {
    return ['searchRoots', 'roots'];
  },
  props(store, props) {
    return {
      roots: store.searchRoots || store.roots,
    };
  },
}, TreeView);

module.exports = WrappedTreeView;