import React, { Component } from "react";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  state = { manager: "", players: [], balance: "", value: "", message: "" };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Transaction is processing..." });
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether")
    });

    this.setState({
      message: "Your participation is enrolled in this contest."
    });
  };

  onClick = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Transaction is processing..." });
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({
      message:
        "A winner has been picked and ETHER transferred to winner account."
    });
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}</p>
        <p>
          There are currently {this.state.players.length} people entered
          competing to win {web3.utils.fromWei(this.state.balance, "ether")}{" "}
          ether.{" "}
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Participate in the contest to WIN ETHER!</h4>
          <div>
            <label>Amount of ether to enter </label>
            <input
              value={this.state.value}
              onChange={event => {
                this.setState({ value: event.target.value });
              }}
            />
          </div>
          <button>Participate</button>

          <hr />
          <h4>Curious to decide a WINNER?</h4>
          <button onClick={this.onClick}>Pick Winner</button>
        </form>

        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
