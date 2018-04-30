import ConvertFileWorker from '../../workers/convertFile.worker.js';
import Notifications from '../../utils/notifications';

import styles from './main.scss';

import FileListItem from './FileListItem';

function* generateID() {
  let ID;

  while (true) {
    ID = (ID === undefined) ? 0 : ID + 1;

    yield ID;
  }
}

const fileReducer = (acc, fileItem) => {
  const id = idGenerator.next().value;

  acc[id] = {
    id,
    file: fileItem,
    base64FileString: undefined,
  };

  return acc;
};

const idGenerator = generateID();

class FileUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      done: false,
      files: {},
    };

    this.handleInputFileChange = this.handleInputFileChange.bind(this);
    this.handleWorkerResponse = this.handleWorkerResponse.bind(this);

    this.workers = undefined;
  }

  componentWillUnmount() {
    if (this.worker) {
      this.worker.terminate();
    }
  }

  intantiateWorker() {
    const worker = new ConvertFileWorker();

    const callback = event => {
      this.handleWorkerResponse(event.data);
    };

    worker.addEventListener('message', callback);

    return worker;
  }

  handleWorkerResponse(data) {
    const { payload, type } = data;

    switch (type) {
      case 'pending': this.handleProcessPending(payload); break;
      case 'success': this.handleProcessSuccess(payload); break;
      case 'done': this.handleProcessSuccessDone(payload); break;
      default: break;
    }
  }

  handleProcessPending(payload) {
    this.setState({
      processFileStatus: 'pending',
    });
  }

  getFiles() {
    const { files } = this.state;
    const accumulatorTemplate = {
      done: [],
      remaining: [],
      all: [],
    };

    const reducer = (acc, key) => {
      const item = files[key];
      const collectionName = (typeof item.file.base64FileString !== 'undefined')
        ? 'done'
        : 'remaining'
      ;

      acc[collectionName].push(item);
      acc.all.push(item);

      return acc;
    };

    return Object.keys(files)
      .reduce(reducer, accumulatorTemplate)
    ;
  }

  showNotification(payload) {
    // const files = this.getFiles();
    // console.log(files);
    // const percentage = `${100 / (files.all.length / files.done.length)}%`;
    const title = 'New file converted!';
    const options = {
      body: `${payload.percentage}%: ${payload.value.file.name} has been converted successfully`,
      // renotify: true,
      // tag: 'file-converted',
      // audio: true, // hack
    };

    const notification = Notifications.create(title, options);

    // close the notification
    // ================================================
    // window.setTimeout(() => {
    //   notification.close();
    // }, 1000)
  }

  handleProcessSuccess(payload) {
    this.showNotification(payload);

    this.setState({
      files: {
        ...this.state.files,
        [payload.value.id]: payload.value,
      },
    });
  }

  handleInputFileChange(event) {
    const { files } = event.target;

    const newFiles = [...files].reduce(fileReducer, {});

    this.setState({
      files: {
        ...this.state.files,
        ...newFiles,
      },
    });

    const worker = this.intantiateWorker();

    worker.postMessage({
      type: 'start',
      payload: {
        type: 'process',
        value: newFiles,
      },
    });
  }

  render() {
    const { files } = this.state;

    const keys = Object.keys(files);

    return (
      <div className={styles['file-upload']}>
        <div className={styles['file-upload--header']}>
          <input
            type='file'
            name='files[]'
            onChange={this.handleInputFileChange}
            multiple
          />
        </div>
        <div className={styles['file-upload--body']}>
          {!!keys.length && keys.map(key => {
            const { file, base64FileString } = files[key];
            const status = (!base64FileString)
              ? 'converting'
              : 'done'
            ;

            return (
              <div className={styles['file-upload--item']} key={key}>
                <FileListItem name={file.name} status={status} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default FileUpload;
