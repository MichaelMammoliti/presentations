import CounterWorker from '../../workers/counter.worker.js';

class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
    };

    // the instance of the worker
    this.workerInstance = undefined;

    // Binding
    this.handleWorkerMessage = this.handleWorkerMessage.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  instantiateWorker() {
    const worker = new CounterWorker();

    worker.addEventListener('message', this.handleWorkerMessage);

    return worker;
  }

  handleWorkerMessage(event) {
    this.setState({
      value: event.data,
    });

    // uncomment this one
    // this.workerInstance.terminate();
  }

  handleButtonClick() {
    this.workerInstance = this.instantiateWorker();

    this.workerInstance.postMessage(this.state.value);
  }

  render() {
    return (
      <div>
        <div>
          <button onClick={this.handleButtonClick}>
            <span>increment</span>
          </button>
        </div>
        <div>
          <span>{this.state.value}</span>
        </div>
      </div>
    );
  }
};

export default Counter;
