const readFile = ({ file, id }) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    const handleLoad = () => {
      const obj = {
        id,
        base64FileString: reader.result,
        file,
      };

      resolve(obj);
    };

    reader.addEventListener('load', handleLoad);
    reader.addEventListener('error', reject);

    reader.readAsDataURL(file);
  });
};

const processFiles = files => {
  let count = 0;

  const success = fileObject => {
    count += 1;

    self.postMessage({
      type: 'success',
      payload: {
        value: fileObject,
        percentage: 100 / (Object.keys(files).length / count),
      },
    });
  };

  const fail = error => {
    self.postMessage({
      type: 'fail',
      payload: {
        value: error,
      },
    });
  };

  // pending
  self.postMessage({
    type: 'pending',
    payload: {},
  });

  Object.keys(files).forEach(key => {
    // we create the file first
    readFile(files[key])
      .then(success)
      .catch(fail)
    ;
  });
};

const handleMessage = data => {
  const { type, payload } = data;

  switch (type) {
    case 'start': processFiles(payload.value); break;

    default: break;
  }
};

self.onmessage = event => {
  handleMessage(event.data);
};