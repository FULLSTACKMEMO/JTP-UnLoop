const hookLoader = () => {
  hookAjax({
    onreadystatechange: function(xhr) {
      if (xhr.responseURL.match('rest/api/2/project\\?&_') && xhr.response.length > 0) {
        try {
          const projectArray = JSON.parse(xhr.response);
          if (projectArray.constructor === Array) {
            projectCount = projectArray.length;
          }
        } catch (err) {
          console.log('projectArray err: ', err);
        }
      }
    },
    onload: function(xhr) {},
    open: function(arg, xhr) {
      if (projectCount !== 0 && blacklistUrl.length >= projectCount) {
        setTimeout(() => {
          if (projectCount !== 0) {
            blacklistUrl = [];
            projectCount = 0;
          }
        }, 30000);
        return true;
      }
      const url = arg[1];
      const blackUrl = _.indexOf(blacklistUrl, url.replace(/&_=[0-9]{13}/, ''));
      if (blackUrl > -1) {
        return true;
      } else {
        if (url.match('rest/api/2/mypermissions.*projectKey=')) {
          blacklistUrl.push(url.replace(/&_=[0-9]{13}/, ''));
        }
      }
    }
  });
};
