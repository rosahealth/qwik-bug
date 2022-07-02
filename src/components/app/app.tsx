import {
  component$,
  useStore,
  useServerMount$,
  useContextProvider,
  createContext,
  useContext,
  useStyles$,
  Host,
} from "@builder.io/qwik";

export const HP_DETAILS_CTX = createContext("rosa.be.hp.details");

export const App = component$(() => {
  const store = useStore<any>({
    hp: null,
  });
  useContextProvider(HP_DETAILS_CTX, store);

  useServerMount$(async () => {
    const simpleHp = {
      name: "Qwik is great",
    };
    store.hp = await Promise.resolve(simpleHp);
  });

  return (
    <Host>
      {store.hp && ( // The bug disappears when the condition is removed
        <HpSummary />
      )}
    </Host>
  );
});

import styles from "./app.css";

export const HpSummary = component$(() => {
  useStyles$(styles); // The bug disappears when the style import is removed
  const state = useContext(HP_DETAILS_CTX);

  return (
    <Host>
      {/* The bug appears when the button is clicked */}
      <button onClick$={() => console.log(state.hp?.name)}>
        {state.hp?.name}
      </button>
    </Host>
  );
});
