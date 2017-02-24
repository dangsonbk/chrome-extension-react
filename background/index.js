import QuoteBackground from './quote';
import followThread from './followThread';
import startCleanTracker from './followThread/cleanTracker';
import PeerChatBackGround from './peerChat';
import startServices from './services';

const VOZ_SOCKET_SERVER = 'http://128.199.183.35:3030';
const quoteBackground = new QuoteBackground();
const peerChartBackground = new PeerChatBackGround(VOZ_SOCKET_SERVER);

followThread();
startCleanTracker();
chrome.runtime.setUninstallURL('https://goo.gl/forms/hA9IzC8XRvJH7pxj2'); // eslint-disable-line no-undef
startServices();

export {
  quoteBackground,
  peerChartBackground,
};
