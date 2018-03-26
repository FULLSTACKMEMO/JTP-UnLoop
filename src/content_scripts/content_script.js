// 注入来至本扩展的js
const scriptLoaderByExt = extJsPath => {
  if (extJsPath) {
    return new Promise((resolve, reject) => {
      if (chrome.runtime.getURL) {
        const theScript = document.createElement('script');
        const src = chrome.runtime.getURL(extJsPath);
        console.log('src: ', src);
        theScript.src = src;
        theScript.onload = () => {
          resolve(theScript);
        };
        theScript.onerror = () => {
          reject(`load ${src} failed`);
        };
        document.querySelector('*').appendChild(theScript);
      } else {
        reject('没有可插入的脚本.');
      }
    });
  }
};

// 注入来至互联网上的js或来至HTML脚本
const scriptLoaderByWeb = ({ src, innerHTML }) => {
  if (src) {
    return new Promise((resolve, reject) => {
      const theScript = document.createElement('script');
      theScript.src = src;
      theScript.onload = () => {
        resolve(theScript);
      };
      theScript.onerror = () => {
        reject(`load ${src} failed`);
      };
      document.querySelector('*').appendChild(theScript);
    });
  }
  const theScript = document.createElement('script');
  theScript.innerHTML = innerHTML;
  document.body.appendChild(theScript);
  return theScript;
};

const main = async () => {
  // 加载脚本
  try {
    console.log('插入脚本...');
    await scriptLoaderByExt('libs/bluebird.min.js');
    await scriptLoaderByExt('libs/lodash.min.js');
    await scriptLoaderByExt('libs/ajaxhook.min.js');
    await scriptLoaderByExt('content_scripts/content_script.js');
    await scriptLoaderByExt('content_scripts/hookLoader.js');
    console.log('脚本插入完毕.');

    scriptLoaderByWeb({
      innerHTML: `
        let blacklistUrl = [];
        let projectCount = 0;
        hookLoader();
      `
    });
  } catch (err) {
    console.log('err: ', err);
  }
};

main();
