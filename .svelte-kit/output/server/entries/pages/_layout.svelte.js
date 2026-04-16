import { h as head, s as slot } from "../../chunks/index.js";
function _layout($$renderer, $$props) {
  head("12qhfyh", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Prueba Lectiva</title>`);
    });
    $$renderer2.push(`<meta name="description" content="Base SvelteKit con arquitectura feature-first/domain-first para integrar Rick and Morty."/>`);
  });
  $$renderer.push(`<div class="app-shell svelte-12qhfyh"><!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></div>`);
}
export {
  _layout as default
};
