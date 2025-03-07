# Markdown to Jupyter Notebook Converter

A simple tool to convert Markdown files to Jupyter Notebook (`.ipynb`) format.

## Features

- Converts Markdown headers to separate cells
- Converts Python code blocks to executable code cells
- Preserves other code blocks as markdown cells
- Maintains the structure of your document
- Handles images and links

## Installation

Clone this repository and install dependencies:

```bash
git clone <repository-url>
cd ai-articles
npm install
```

Make the script executable:

```bash
chmod +x md-to-ipynb.js
```

## Usage

### As a command-line tool

```bash
node md-to-ipynb.js <input-markdown-file> [output-notebook-file]
```

If you don't specify an output file, it will use the same name as the input file but with a `.ipynb` extension.

### Using npm script

```bash
npm run convert -- <input-markdown-file> [output-notebook-file]
```

### Examples

Convert a single file:

```bash
node md-to-ipynb.js pydantic_agents_article.md
```

This will create `pydantic_agents_article.ipynb` in the same directory.

Specify an output file:

```bash
node md-to-ipynb.js pydantic_agents_article.md python-agents-tutorial.ipynb
```

## How It Works

The converter:

1. Reads the Markdown file
2. Splits content into cells based on headers and code blocks
3. Converts Python code blocks to executable code cells
4. Preserves other content as markdown cells
5. Creates a properly formatted Jupyter Notebook JSON structure
6. Writes the result to the output file

## Limitations

- Code blocks must be properly formatted with triple backticks (```)
- Python code blocks must be explicitly marked with ```python
- The converter doesn't execute any code cells

## License

ISC 