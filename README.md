# EdgeFarm Portal

Diese Anwendung basiert auf der Anwendung Backstage von Spotify
Relevante Docs sind

- https://backstage.io/docs/overview/what-is-backstage
- https://github.com/backstage/backstage

## Directory Structure

Diese Anwendung ist entstanden durch eine Art Boilerplate, welche die Backstage Entwickler zur Verfügung stellen. Siehe https://backstage.io/docs/getting-started/
Jegliche Änderungen am Backstage, welches von Spotify kontinuierlich weiterentwickelt wird, sind nicht direkt in diese Portal Anwendung einzupflegen sondern über den yarn package Manager verwaltet. Spotify bietet hierzu einen Ausführlichen Upgrade Guide an: https://backstage.io/docs/getting-started/keeping-backstage-updated

Die Ordnerstruktur ist daher durch die Boilerplate entstanden.

```
/
  /node_modules # Beinhaltet alle dependencies, welche durch den package manager yarn installiert wurden
  /packages
    /app # Hier findest du alle notwendigen Dateien für das Frontend
      /public # Dateien die jederzeit im Browser zugänglich sind
      /src # Alle relevanten Dateien in denen entwickelt wird
    /backend # Hier findest du alle notwendigen Dateien für das Frontend
  /plugins # Potenzieller Ort um Plugins zu entwickeln. Die Idee hinter einem Plugin ist die wiederverwendbarkeit auf modulare Art.
    /edgefarm # Ein Plugin welches alle Erweiterungen im Frontend beinhaltet
    /edgefarm-backend # Ein Plugin welches alle Erweiterungen im Backend beinhaltet. Insbesondere die Kubernetes Anbindung.
```

Weitere Details zu der struktur findest du hier: https://backstage.io/docs/getting-started/project-structure

## Tooling

### Package Manager

Als Package Manager wird `yarn` verwendet. Mittels yarn lassen sich alle Dependencies installieren die in der package.json definiert sind. Man unterscheidet dort zwischen dependencies und dev-dependencies. Letztere werden bei der ausfuehrung `yarn install --production` nicht mit installiert.

Als alternative hierzu gaebe es den Package Manager `npm`, welcher Stand heute keine Vorteile oder Nachteile bringt, aber SPotify hatte sich fuer yarn entschieden, daher wird dieser auch hier verwendet.

### Building Tools

Das Typescript muss in Javascript umbewandelt werden und das Javascript buendelt man in der Regel in eine oder teils mehrere groessere Dateien. Hierfuer ist Webpack und Rollup zustaendig.
In der Backstage Doku steht hierzu folgendes: `Under the hood the CLI uses Webpack for bundling, Rollup for building packages, Jest for testing, and eslint for linting.`
Siehe auch https://backstage.io/docs/local-dev/cli-overview/#introduction

### Run application locally

`yarn dev` startet sowohl Fronend als auch Backend ohne Debugger
`yarn start` startet nur das Frontend. Debuggung erfolgt ueber die Entwicklerkonsole im Browser.
`yarn start-backend` startet nur das Backend. Startet man das Backend mit `yarn start-backend --inspect` ueber VSCode wird ein Debugger attached.

Weitere Informationen dazu findest du hier https://backstage.io/docs/local-dev/debugging
