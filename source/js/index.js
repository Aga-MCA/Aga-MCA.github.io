import load from './load/interface.js';
import translate from "./load/translate.js";

window.addEventListener('DOMContentLoaded', async ()=>load(await translate()));