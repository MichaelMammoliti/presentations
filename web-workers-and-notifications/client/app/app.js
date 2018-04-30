// import Notification from './libs/notifications';
import Counter from './components/Counter';
import FileUpload from './components/FileUpload';
import Notifications from './utils/notifications.js';

import styles from './app.scss';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notificationStatus: undefined,
      notificationErrorMessage: '',
    };

    this.handleNotificationSuccess = this.handleNotificationSuccess.bind(this);
    this.handleNotificationReject = this.handleNotificationReject.bind(this);
    this.handleNotificationLoading = this.handleNotificationLoading.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  componentDidMount() {
    this.enableNotifications();
  }

  // Notifications
  // ====================================
  enableNotifications() {
    this.handleNotificationLoading();

    Notifications.request()
      .then(this.handleNotificationSuccess)
      .catch(this.handleNotificationReject)
    ;
  }

  // Event Handlers - Notification
  // ====================================
  handleNotificationSuccess() {
    window.setTimeout(() => {
      this.setState({
        notificationStatus: 'success',
        notificationErrorMessage: '',
      });
    }, 1000);
  }

  handleNotificationReject(error) {
    this.setState({
      notificationStatus: 'fail',
      notificationErrorMessage: error,
    });
  }

  handleNotificationLoading() {
    this.setState({
      notificationStatus: 'loading',
    });
  }

  // Event Handlers - Button
  // ====================================
  handleButtonClick() {
    this.enableNotifications();
  }

  // Render
  // ====================================
  render() {
    const { notificationStatus } = this.state;

    return (
      <div className={styles['app']}>
        {(!notificationStatus || notificationStatus === 'fail') &&
          <div>
            <span>this site requires notifications.</span>
            <br />
            <button onClick={this.handleButtonClick}>Enable notifications</button>
          </div>
        }

        {(notificationStatus === 'loading') &&
          <div>
            <span>loading content</span>
          </div>
        }

        {(notificationStatus === 'success') &&
          <div>
            <div className={styles['app-item']}>
              <Counter />
            </div>
            <div className={styles['app-item']}>
              <FileUpload />
            </div>
          </div>
        }
      </div>
    );
  }
};

export default App;
