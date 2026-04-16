import { f as fallback, a as ensure_array_like, b as attr, e as escape_html, c as bind_props } from "../../chunks/index.js";
import { g as goto } from "../../chunks/client.js";
function CharacterList($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let characters = fallback($$props["characters"], () => [], true);
    if (characters.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="empty svelte-tg8uui">No hay resultados para ese filtro.</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="grid svelte-tg8uui"><!--[-->`);
      const each_array = ensure_array_like(characters);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let character = each_array[$$index];
        $$renderer2.push(`<article class="card svelte-tg8uui"><img${attr("src", character.image)}${attr("alt", character.name)} loading="lazy" class="svelte-tg8uui"/> <div class="content svelte-tg8uui"><h2 class="svelte-tg8uui">${escape_html(character.name)}</h2> <p class="svelte-tg8uui">${escape_html(character.status)} · ${escape_html(character.species)}</p> <dl class="svelte-tg8uui"><div><dt class="svelte-tg8uui">Origen</dt> <dd class="svelte-tg8uui">${escape_html(character.originName)}</dd></div> <div><dt class="svelte-tg8uui">Ubicación</dt> <dd class="svelte-tg8uui">${escape_html(character.locationName)}</dd></div></dl></div></article>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { characters });
  });
}
function CharacterSearch($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let query = fallback($$props["query"], "");
    let onQueryChange = $$props["onQueryChange"];
    $$renderer2.push(`<label class="search svelte-lhhdwe"><span class="svelte-lhhdwe">Buscar personaje</span> <input type="search" placeholder="Rick, Morty, Summer..."${attr("value", query)} class="svelte-lhhdwe"/></label>`);
    bind_props($$props, { query, onQueryChange });
  });
}
function CharacterBrowser($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    let onQueryChange = $$props["onQueryChange"];
    $$renderer2.push(`<section class="hero svelte-dxgl14"><div class="eyebrow svelte-dxgl14">SvelteKit · Rick and Morty</div> <h1 class="svelte-dxgl14">Arquitectura frontend lista para crecer sin mezclar UI con negocio.</h1> <p class="svelte-dxgl14">Base feature-first/domain-first con contratos claros entre pantalla, dominio y API.</p></section> <div class="panel svelte-dxgl14">`);
    CharacterSearch($$renderer2, { query: data.query, onQueryChange });
    $$renderer2.push(`<!----> <div class="meta svelte-dxgl14"><p class="svelte-dxgl14">${escape_html(data.total)} personajes</p> `);
    if (data.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="error svelte-dxgl14">${escape_html(data.error)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    CharacterList($$renderer2, { characters: data.characters });
    $$renderer2.push(`<!----></div>`);
    bind_props($$props, { data, onQueryChange });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    function updateQuery(value) {
      const trimmed = value.trim();
      const params = new URLSearchParams();
      if (trimmed) {
        params.set("q", trimmed);
      }
      const target = params.toString() ? `/?${params.toString()}` : "/";
      goto(target, {});
    }
    CharacterBrowser($$renderer2, { data, onQueryChange: updateQuery });
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
