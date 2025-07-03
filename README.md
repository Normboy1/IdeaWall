# Idea Wall 🎯

A playful web app where you can throw crumpled post-it notes (ideas) onto a wall. Built with React, TypeScript, and Framer Motion.

![Idea Wall Screenshot](./public/screenshot.png)

## Features ✨

- 🎨 Create colorful sticky notes with titles and descriptions
- 🎯 Toss notes onto the wall with a satisfying animation
- 🔫 Toggle water gun mode to shoot down notes you don't need
- 🎨 Customize note colors
- 📱 Fully responsive design that works on all devices
- ♿ Built with accessibility in mind
- 🎉 Fun animations and interactions

## Getting Started 🚀

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/idea-wall.git
   cd idea-wall
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## Usage 📝

### Adding a Note
1. Type a title and optional description in the form at the bottom of the screen
2. Click "Add Note" or press Enter to throw the note onto the wall
3. Watch it land with a satisfying animation!

### Removing a Note
1. Click the "Water Gun Mode" button to activate water gun mode
2. Click on any note to shoot it down
3. Click the button again to exit water gun mode

### Moving Around
- Click and drag to pan around the board
- On touch devices, use two fingers to pan and pinch to zoom
- Double tap to reset the view

## Tech Stack 🛠️

- ⚛️ [React](https://reactjs.org/) - UI library
- 🦕 [TypeScript](https://www.typescriptlang.org/) - Type checking
- ⚡ [Vite](https://vitejs.dev/) - Build tool
- 🎨 [Styled Components](https://styled-components.com/) - Styling
- 🎭 [Framer Motion](https://www.framer.com/motion/) - Animations
- 🧪 [Jest](https://jestjs.io/) & [Testing Library](https://testing-library.com/) - Testing

## Project Structure 📁

```
src/
├── components/         # Reusable UI components
├── context/            # React context providers
├── features/           # Feature-based modules
│   ├── board/          # Board component and related logic
│   └── notes/          # Note-related components and context
├── styles/             # Global styles and theme
├── test-utils/         # Testing utilities
└── types/              # TypeScript type definitions
```

## Testing 🧪

Run the test suite:

```bash
npm test
# or
yarn test
```

Run tests in watch mode:

```bash
npm test -- --watch
# or
yarn test --watch
```

## Building for Production 🏗️

Create a production build:

```bash
npm run build
# or
yarn build
```

## Accessibility ♿

This app has been built with accessibility in mind:

- Semantic HTML5 elements
- ARIA attributes where appropriate
- Keyboard navigation support
- Focus management
- Screen reader support

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
