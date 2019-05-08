import React from "react";
import { connect } from "react-redux";
import { setSourceDataInput } from "./redux/module/dataSource";

@connect(
  store => store,
  { setSourceDataInput }
)
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.changeHandler = this.changeHandler.bind(this);
  }

  asyncBootstrap() {
    let that = this;
    console.log(that)
    return new Promise(resolve => {
      that.props.setSourceDataInput(20);
    });
  }

  componentWillMount() {
    // this.props.setSourceDataInput(20);
  }

  componentDidMount() {}
  render() {
    return (
      <h1>
        <button onClick={this.changeHandler}>
          React{this.props.dataSource.pageSize}
        </button>
      </h1>
    );
  }
  changeHandler() {
    this.props.setSourceDataInput(20);
  }
}