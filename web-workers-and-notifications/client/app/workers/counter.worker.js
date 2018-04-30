self.addEventListener('message', event => {
  self.postMessage('calculating');

  setTimeout(() => {
    self.postMessage(event.data + 1);
  }, 2000);
});
