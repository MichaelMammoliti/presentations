let permissionStatus = undefined;
let permissionRequest = undefined;

const requestPermission = () => {
  return window.Notification.requestPermission();
};

const enable = () => {
  return window.Notification.requestPermission();
};

const disable = () => {
  return window.Notification.requestPermission();
};

const create = () => {
  const options = {
    actions: [
      { action: 'like', title: '👍Like' },
      { action: 'reply', title: '⤻ Reply' },
    ],
  };

  const notification = new Notification('something', options);

  notficiation.onClick = () => {
    console.log('clicked');
  }
};

const init = () => {
  permissionRequest = requestPermission();

  const check = state => {
    permissionStatus = state;

    if (state === 'granted') return Promise.resolve();
    if (state === 'denied') return Promise.reject();
  };

  const success = state => {
    const instance = create();
  };

  const fail = (e) => {
    console.log(e);
  };

  permissionRequest
    .then(check)
    .then(success)
    .catch(fail)
  ;
};

export default {
  requestPermission,
  enable,
  disable,
  init,
};
