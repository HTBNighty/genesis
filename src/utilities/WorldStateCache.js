import EventEmitter from 'events';
import fetch from './Fetcher.js';
import logger from './Logger.js';
import { apiBase } from './CommonFunctions.js';

const worldStateURLs = {
  pc: `${apiBase}/pc?language=en`,
  ps4: `${apiBase}/ps4?language=en`,
  xb1: `${apiBase}/xb1?language=en`,
  swi: `${apiBase}/swi?language=en`,
};

export default class WorldStateCache extends EventEmitter {
  constructor(platform, timeout) {
    super();
    this.url = worldStateURLs[platform];
    this.timeout = timeout;
    this.currentData = undefined;
    this.lastUpdated = undefined;
    this.updating = undefined;
    this.platform = platform;
    this.updateInterval = setInterval(() => this.update(), timeout);
    this.update();
  }

  async getData() {
    if (this.updating) {
      return this.updating;
    }
    return this.currentData;
  }

  async update() {
    try {
      this.lastUpdated = Date.now();
      this.currentData = await fetch(`${this.url}&ts=${Date.now()}`);
      this.updating = undefined;
      this.emit('newData', this.platform, this.currentData);
      return this.currentData;
    } catch (err) {
      this.updating = undefined;
      logger.debug(err);
    }
    return this.updating;
  }
}
