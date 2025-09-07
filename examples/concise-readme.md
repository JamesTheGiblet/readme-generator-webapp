# Code-Snippets Library

> A lightweight, zero-dependency library for managing and sharing code snippets.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

**Live Demo:** [https://example.com/code-snippets](https://example.com/code-snippets)

## Features

- Zero-dependency and tree-shakable.
- Syntax highlighting support.
- Simple and intuitive API.
- TypeScript support out of the box.

## Tech

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## Installation

```sh
npm install code-snippets-lib
```

## Usage

```javascript
import { getSnippet } from 'code-snippets-lib';

const mySnippet = getSnippet('javascript', 'console.log("Hello, World!");');
document.body.innerHTML = mySnippet.html;
```
