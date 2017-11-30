import './ga';
import QuoteBackground from './quote';
import followThread from './followThread';
import startCleanTracker from './followThread/cleanTracker';
import startServices from './services';
import { injectOptionalCSS } from './optionalCSS';

const quoteBackground = new QuoteBackground();

// Test notification remove, it is ok
// for (let i = 0; i < 3; i++) {
//   setTimeout(() => chrome.notifications.create('voz-living', {
//     type: 'basic',
//     title: 'VOZLiving',
//     message: 'test cái coi',
//     iconUrl: '../assert/icon/64.png',
//   }, (noti5Id1) => {
//     const handler = (noti5Id2) => {
//       console.log(i);
//       console.log(noti5Id1, noti5Id2);
//       chrome.notifications.clear('voz-living');
//       chrome.notifications.onClicked.removeListener(handler);
//     };
//     chrome.notifications.onClicked.addListener(handler);
//   }), 3000*i);
// }

followThread();
startCleanTracker();
chrome.runtime.setUninstallURL('https://goo.gl/forms/hA9IzC8XRvJH7pxj2'); // eslint-disable-line no-undef
startServices();

chrome.tabs.onCreated.addListener(injectOptionalCSS);
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status && info.status === 'loading') injectOptionalCSS(tab);
});

export {
  quoteBackground,
};
