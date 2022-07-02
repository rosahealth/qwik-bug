# How to reproduce the bug
1. Start the project by running `npm run dev.ssr`
2. Click on the button `Qwik is awesome`

It must be the first load, just after having run `npm run dev.ssr`
Be sure not to have multiple tabs open. If you reload the client (Cmd+R), the bug will disappear.
# Observations

## Console output (server)

````
QWIK Dropping render. State changed during render.
QWIK ERROR Error: server can not rerender
    at logError (/Users/antoinepairet/sources/qwik-demo-hackathon/node_modules/@builder.io/qwik/server.cjs:175:52)
    at Object.raf (/Users/antoinepairet/sources/qwik-demo-hackathon/node_modules/@builder.io/qwik/server.cjs:575:7)
    at renderMarked (/Users/antoinepairet/sources/qwik-demo-hackathon/node_modules/@builder.io/qwik/core.cjs:3497:25)
QWIK WARN unconnected element DIV 
````

## "null" string present in `qwik/json`

````json
{
  "ctx": {
    "#1": {
      "h": "2! 8",
      "s": "1! 5 5",
      "c": "rosa.be.hp.details=1!"
    },
    "#0": {
      "h": "0! 4",
      "s": "5 1!"
    },
    "#3": {
      "r": "1!"
    }
  },
  "objs": [
    {},
    {
      "hp": "6"
    },
    {},
    {},
    "\u0011/src/hpsummary_component_d9v7z4bawqq.js#HpSummary_component_d9V7Z4baWqQ",
    true,
    {
      "name": "7"
    },
    "Qwik is great",
    "\u0011/src/app_component_phd2gpd60zy.js#App_component_PHD2gpD60ZY"
  ],
  "subs": [
    {
      "$": 2
    },
    {
      "#0": [
        "hp"
      ],
      "#1": [
        "hp"
      ],
      "null": [
        "hp"
      ]
    },
    {
      "$": 2
    },
    {
      "$": 2
    }
  ]
}
````


## Console output on the client
When clicking on the button, the app crashes with the error `Expected 'false' to be 'true'`
In `store.ts`, the `reviveValues` function has `const el = getObject(entry[0])`, since `entry[0]` is the string `"null"`, the app crashes:
- `strToInt("null")` corresponds to `parseInt("null", 36)` and gives `1112745`
- `getObjectImpl` will assert that `objs.length` is larger than the index we want to acces, which is `1112745` 
- `assertEqual(objs.length > index, true);` // `assertEqual(obj.length > 1112745, true)`

# Questions
- How are the keys of the subscriptions computed?

