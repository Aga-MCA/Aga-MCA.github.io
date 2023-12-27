import { Link } from "./Link.js";

export function Home() {
  return [
    Link('/all/', {class:'mc-button'}, lang.get('home.start')),
    Link('/config/', {class:'mc-button'}, lang.get('home.config')),
  ]
}